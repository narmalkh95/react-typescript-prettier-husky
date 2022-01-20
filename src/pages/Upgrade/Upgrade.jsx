import UserHeader from '../../components/UserHeader/UserHeader';
import UpgradeCard from '../../components/UpgrageCard/UpgradeCard';

import { useHistory } from 'react-router-dom';
import paths from '../../utils/routing';

import upgradeData from '../../utils/upgrade';
import './Upgrade.scss';

function Upgrade(props) {
    const history = useHistory();

    return (
        <div className='updrade_card_container'>
            <UserHeader />
            <div className='most_popular_container'>
                <div className='most_popular_div'>
                    Most popular
                </div>
            </div>
            <div className='upgrade_container'>
                <UpgradeCard
                    header={upgradeData.Free.header}
                    subHeader={upgradeData.Free.subHeader}
                    price={upgradeData.Free.price}
                    body={upgradeData.Free.body}
                    button_text={upgradeData.Free.button_text}
                />
                <UpgradeCard
                    header={upgradeData.Business.header}
                    subHeader={upgradeData.Business.subHeader}
                    price={upgradeData.Business.price}
                    body={upgradeData.Business.body}
                    button_text={upgradeData.Business.button_text}
                    hasShadow={true} 
                />
                <UpgradeCard
                    header={upgradeData.Enterprise.header}
                    subHeader={upgradeData.Enterprise.subHeader}
                    price={upgradeData.Enterprise.price}
                    body={upgradeData.Enterprise.body}
                    button_text={upgradeData.Enterprise.button_text}
                    handleUpgradeButtonClick={() => history.push(paths.ContactUs)}
                />
            </div>
        </div>
    )
}

export default Upgrade;