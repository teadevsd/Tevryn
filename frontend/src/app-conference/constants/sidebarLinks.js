export const sideBarLinks = [
    {
        label: 'Home',
        route: '/conference',  // Fix: Home is part of conference now
        imgUrl: '/icons/Home.svg'
    },
    {
        label: 'Upcoming',
        route: '/conference/upcoming',  // Fix: Added "/conference"
        imgUrl: '/icons/upcoming.svg'
    },
    {
        label: 'Previous',
        route: '/conference/previous',  // Fix: Added "/conference"
        imgUrl: '/icons/previous.svg'
    },
    {
        label: 'Recordings',
        route: '/conference/recordings',  // Fix: Added "/conference"
        imgUrl: '/icons/Video.svg'
    },
    {
        label: 'Personal Room',
        route: '/conference/personal-room',  // Fix: Added "/conference"
        imgUrl: '/icons/add-personal.svg'
    }
];
