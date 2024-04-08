// import Signup from "@/pages/Signup";
import Room from "@/pages/Room";
import Landing from "@/pages/Landing";

// interface RouteType {
//     path: string;
//     element: React.FC;
// }

// const publicRoutes: RouteType[] = [
//     // {
//     //     path: '/:roomid',
//     //     element: < Room/>
//     // },
//     // {
//     //     path: '/signup',
//     //     element: < Signup/>
//     // }
// ];

const privateRoutes = [
    {
        path: '/:roomid',
        element: < Room/>
    },
    {
        path: '/',
        element: < Landing/>

    }
];

export { privateRoutes };