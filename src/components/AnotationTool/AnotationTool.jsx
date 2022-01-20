import React, { useState, useEffect, useRef } from 'react';
import * as mjs from 'mjs2-edit';

import { Toaster, ToasterType } from '../Toaster/Toaster';
import './AnotationTool.scss';

const AnotationTool = ({ folderName, imageIndex, isRotationAllowed, image, setNotes, marks }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [MA, setMA] = useState(null) // MarkerArea global state
    const [markerAreaState, setMarkerAreaState] = useState() // MarkerArea state for restoring
    // eslint-disable-next-line
    const [markersInfoArray, setMarkersInfoArray] = useState([]) // markers with filtered info for backend
    const [loading, setLoading] = useState(false)
    const sourceImageRef = useRef(null) // image in initial state, withouth markers
    const sampleImageRef = useRef(null) // image, which we redact
    const selectedMarker = useRef(null) // TODO // to check marker selecting state
    // eslint-disable-next-line
    const notes = useRef({}) // labels array
    const dropboxDivRef = useRef(null)
    const markersArray = useRef([]) // TODO // to save markers state for backend

    const showMarkerArea = () => {
        MA.show(); // show markerArea on image
        if (markerAreaState) { // if we have initial state, restore it
            sampleImageRef.current.style.opacity = 0;
            sourceImageRef.current.style.top = -40 + 'px';
            MA.restoreState(markerAreaState)
        }
        if (!markerAreaState?.markers?.length) {
            MA.createNewMarker(mjs.FrameMarker)
        }
    }

    useEffect(() => { // INIT //
        MA?.close();
        const initialMarkerState = {
            width: sampleImageRef.current?.clientWidth ?? 512,
            height: sampleImageRef.current?.clientHeight ?? 512,
            markers: marks?.map((mark, index) => ({
                containerTransformMatrix: mark.matrix || { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
                fillColor: "transparent",
                height: mark.height,
                width: mark.width,
                top: mark.y || 0,
                left: mark.x || 0,
                id: index,
                notes: mark.name,
                opacity: 1,
                prevNotes: undefined,
                rotationAngle: mark.angle,
                state: "select",
                strokeColor: "#69dafb",
                strokeDasharray: "",
                strokeWidth: 3,
                typeName: "FrameMarker",
                visualTransformMatrix: { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }
            })) || []
        }
        setMarkerAreaState(initialMarkerState);

        setNotes(getNotesFromMarkers(marks));

        markersInfoArray.current = initialMarkerState.markers || {};

        notes.current = getNotesFromMarkers(marks);

        if (sampleImageRef.current) {

            const markerArea = new mjs.MarkerArea(sampleImageRef.current);
            markerArea.renderAtNaturalSize = true;
            markerArea.availableMarkerTypes = [mjs.FrameMarker];
            markerArea.targetRoot = sampleImageRef.current.parentElement;
            markerArea.uiStyleSettings.undoButtonVisible = false;
            markerArea.settings.defaultColor = "#69dafb";
            markerArea.settings.defaultFillColor = "#69dafbcc"

            markerArea.settings.isRotationAllowed = isRotationAllowed;
            markerArea.uiStyleSettings.hideToolbar = false;
            markerArea.uiStyleSettings.hideToolbox = true;
            markerArea.uiStyleSettings.notesButtonVisible = false;
            markerArea.uiStyleSettings.selectButtonVisible = false;
            markerArea.uiStyleSettings.notesAreaStyleClassName = 'dropboxDiv';
            markerArea.uiStyleSettings.toolbarStyleColorsClassName = 'PF';
            markerArea.uiStyleSettings.toolBarMaxWidth = getWidth() + 'px';
            markerArea.uiStyleSettings.toolboxStyleColorsClassName = 'DN'
            markerArea.uiStyleSettings.toolboxPanelRowStyleColorsClassName = 'DN'
            markerArea.uiStyleSettings.toolboxButtonRowStyleColorsClassName = 'DN'

            markerArea.show();
            markerArea.restoreState(initialMarkerState);

            markerArea.addRenderEventListener((dataUrl, state) => {

                if (sampleImageRef.current) {
                    sampleImageRef.current.src = dataUrl; // render image with drawed markers
                    setMarkerAreaState(state); // save state of MarkerArea to be able to restore it

                    markersArray.current = state.markers; // TODO //

                    const markers = markersArray.current.map((i, id) => {
                        for (const key in i.containerTransformMatrix) {
                            if (Object.hasOwnProperty.call(i.containerTransformMatrix, key)) {
                                if (i.containerTransformMatrix[key] === 1) {
                                    i.containerTransformMatrix[key] -= 10e-10
                                } else {
                                    i.containerTransformMatrix[key] += 10e-10
                                }
                            }
                        }

                        return ({
                            width: i.width + 10e-10,
                            height: i.height + 10e-10,
                            angle: isRotationAllowed ? i.rotationAngle + 10e-10 : undefined,
                            name: i.notes.trim(),
                            x: i.left + 10e-10,
                            y: i.top + 10e-10,
                            matrix: isRotationAllowed ? i.containerTransformMatrix : undefined
                        })
                    })

                    if (markers.some(marker => marker.name.includes(' '))) {
                        Toaster.notify('The label can\'t include spaces.', ToasterType.failure);
                        return;
                    }

                    const toasterId = Toaster.notify('Creating an XML file for your image.', ToasterType.info);
                    const data = {
                        folder_name: folderName,
                        img_index: imageIndex,
                        labels: markers
                    }
                    setLoading(true)
                    fetch(`${apiUrl}${isRotationAllowed ? 'rbb' : 'bb'}`, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            "x-access-token": localStorage.getItem('token')
                        },
                        body: JSON.stringify(data)
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.status === 'fail') {
                                let message = "Something went wrong. Try again.";
                                if (res.message?.labels) {
                                    message = "There are no labels to save.";
                                }

                                Toaster.update(toasterId, message, ToasterType.failure);
                                return;
                            }
                            if (markerArea.getState().markers.length) {
                                const prevNote = selectedMarker?.current?.prevNote;
                                const note = markerArea.hideNotesEditor();
                                if (note) {
                                    if (prevNote) {
                                        notes.current[prevNote]--;
                                        notes.current[note]++ || (notes.current[note] = 1);

                                        if (notes.current[prevNote] < 1) {
                                            delete notes.current[prevNote]
                                        }
                                    } else {
                                        notes.current[note]++ || (notes.current[note] = 1);
                                    }
                                    setNotes({...notes.current});
                                }

                                selectedMarker.current = null;
                                markerArea.setCurrentMarker();
                            }
                            Toaster.update(toasterId, 'The XML has been generated successfully.', ToasterType.success);
                        })
                        .catch(e => {
                            Toaster.update(toasterId, e, ToasterType.failure);
                        })
                        .finally(() => {
                            setLoading(false)
                            setTimeout(() => {
                                Toaster.dismiss(toasterId)
                            }, 2000)
                        })
                }
            });

            markerArea.addDeleteEventListener(marker => {
                if (isMarkerSaved(marker)) {
                    if (marker.notes && notes.current[marker.notes]) {
                        notes.current[marker.notes]--;
                        if (notes.current[marker.notes] < 1) {
                            delete notes.current[marker.notes]
                        }
                        setNotes({...notes.current});
                    }
                }
            });
            markerArea.addDeselectEventListener(marker => {
                if (!isMarkerSaved(marker)) {
                    markerArea.setCurrentMarker(marker);
                    // throws error, when deleting unsaved box, but is needed on deselecting.
                    try { markerArea.deleteSelectedMarker(false); } catch (e) {}
                }
                markerArea.hideNotesEditor();
                selectedMarker.current = null;
            });

            markerArea.addSelectEventListener((marker, id) => {
                if (markerArea.getState().markers.length) {
                    if (id !== selectedMarker.current) {
                        const { notesArea, currentValue } = markerArea.showNotesEditor();

                        selectedMarker.current = { id: marker.id, prevNote: currentValue }

                        dropboxDivRef.current = notesArea;

                        const mState = marker.getState()
                        notesArea.style.left = mState.left - 20 + 'px'
                        notesArea.style.top = mState.top + mState.height + 'px'
                    }
                }
            });

            markerArea.addMoveEventListener((marker) => {
                const { notesArea } = markerArea.showNotesEditor();

                const mState = marker.getState()
                notesArea.style.left = mState.left - 20 + 'px'
                notesArea.style.top = mState.top + mState.height + 'px'
            })

            markerArea.addCloseEventListener(() => {
                sampleImageRef.current.style.opacity = 1;
                sampleImageRef.current.style.top = 0;
             });

            markerArea.addNoNotesEventListener(markersWithoutNotes => {
                markersWithoutNotes[0].select()
                markerArea.setCurrentMarker(markersWithoutNotes[0])
                const mState = markersWithoutNotes[0].getState()
                const { notesArea } = markerArea.showNotesEditor()

                notesArea.style.left = mState.left - 20 + 'px'
                notesArea.style.top = mState.top + mState.height + 'px'
                notesArea.select()
            })

            setMA(markerArea);
        }
    }, [isRotationAllowed, image, marks, setNotes])

    const isMarkerSaved = marker => {
        return markersInfoArray.current.some(markerInfo => markerInfo.id === marker.id && markerInfo.notes === marker.notes) ||
            markersArray.current.some(m => m.id === marker.id && m.notes === marker.notes);
    }

    const getNotesFromMarkers = (marks) => {
        const notes = {};
        marks?.forEach(mark => {
            if (notes[mark.name]) {
                notes[mark.name]++;
            } else {
                notes[mark.name] = 1;
            }
        });

        return notes;
    }

    const getWidth = () => {
        let offsetWidth = document.getElementById('annotationContainer')?.offsetWidth;
        offsetWidth = offsetWidth || 700;

        return sampleImageRef.current.naturalWidth < offsetWidth ? sampleImageRef.current.naturalWidth : offsetWidth;
    }

    return (
        <div className='anotationToolBox' id='annotationContainer'>
            <div className='anoImageBox'>
                <img
                    src={image}
                    ref={sampleImageRef}
                    alt='Sample'
                    crossOrigin='anonymous'
                    onClick={() => {
                        if (!loading) showMarkerArea()
                    }}
                />
            </div>
        </div>
    );
}

export default AnotationTool;
