
import React, { useContext } from "react";
import { ResponsiveContext } from 'grommet'

const sizes = ["default", "hair", "xxsmall", "xsmall", "small", "medium", "large", "xlarge"];

function useResponsive() {
    const currentSize = useContext(ResponsiveContext);
    return (settings) => sizes.reduce( (value, size, index) => 
    (settings[size] && index <= sizes.indexOf(currentSize)) ? settings[size] : value , '')
}

export default useResponsive;
