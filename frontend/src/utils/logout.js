import React from 'react'

export default function wyloguj() {

function wyloguj() {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("role");
    window.location.href = "/start";
};

    return (
        <>
            {wyloguj()}
        </>
    )
}