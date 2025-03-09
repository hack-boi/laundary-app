import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {

    const { userAuth: { fullname }, setUserAuth } = useContext(UserContext);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null });
    }
    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={{ duration: 0.2 }}
        >
            <div className="bg-white absolute right-0 border border-gray-200 w-60 duration-200">
                <button
                    className="text-left p-4 hover:bg-gray-200 w-full pl-8 py-4 cursor-pointer"
                    onClick={signOutUser}
                >
                    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                    <p className="text-gray-600">@{fullname}</p>
                </button>
            </div>
        </AnimationWrapper>
    )
}

export default UserNavigationPanel;
