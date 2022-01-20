const upgradeData = {
    Free: {
        header: 'Free',
        subHeader: 'For anyone to get started',
        price: 0,
        body: [
            'up to 500 images', 'single user', 'up to 1024x1024 resolution size', 'detection on single image', 'manual rotated and bounding box annotation', '10% manual correction'
        ],
        button_text: 'Sign Up It\'s FREE'
    },
    Business: {
        header: 'Business',
        subHeader: 'For solo preneurs, bootstrappers, early stage startups',
        price: 17,
        body: [
            'everything in FREE package, plus ...', 'up to 1000 images', 'up to 1024x1024 resolution size', 'full data automated annotation', 'video annotation (coming soon)', '10-15% manual correction'
        ],
        button_text: 'Get Started'
    },
    Enterprise: {
        header: 'Enterprise',
        subHeader: 'Per image type and image number',
        price: 100,
        body: [
            'everything in Business package, plus ...', 'unlimited images', 'multiple users','up to 4096x4096 resolution size', '24/7 support by our Data Experts', 'Custom feature requests'
        ],
        button_text: 'Contact Us'
    }
}

export default upgradeData;
