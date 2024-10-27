import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

const Logo = (props) => {
  const { color = "#000000", ...otherProps } = props;

  return (
    <SvgIcon {...otherProps} viewBox="0 0 512 512">
      <g>
        <g>
          <path
            fill={color}
            d="M480.88,63.139c-78.226-1.148-132.566,35.409-164.35,66.281c-20.889,20.291-34.881,40.545-42.787,53.611
              c-2.432-2.429-5.36-4.357-8.614-5.632c1.902-6.666,6.309-16.435,13.648-27.853c10.125-15.748,22.144-28.923,32.977-36.145
              c3.684-2.455,4.68-7.433,2.223-11.116c-2.455-3.683-7.433-4.679-11.116-2.223c-18.533,12.354-36.777,36.54-46.86,57.235
              c-10.082-20.695-28.328-44.881-46.86-57.235c-3.683-2.455-8.661-1.461-11.117,2.223c-2.456,3.683-1.461,8.661,2.223,11.117
              c20.726,13.818,41.748,46.744,46.664,63.983c-3.27,1.274-6.212,3.208-8.653,5.647c-7.906-13.066-21.897-33.322-42.787-53.611
              C163.686,98.548,109.387,61.989,31.12,63.139C13.907,63.391-0.052,77.531,0,94.659c0.099,32.097,3.664,91.793,26.425,130.988
              c9.286,15.989,26.479,25.922,44.869,25.922h19.354c-16.063,16.909-39.342,46.721-39.342,77.495
              c0,12.569,5.517,27.745,15.951,43.887c9.526,14.734,22.879,29.715,37.599,42.185c25.753,21.816,52.397,33.754,74.689,33.754
              c3.216,0,6.343-0.249,9.362-0.753c20.506-3.417,39.413-27.586,56.197-71.834c0.998-2.632,1.955-5.25,2.877-7.846v3.363
              c0,4.427,3.589,8.017,8.017,8.017s8.017-3.589,8.017-8.017v-3.363c0.922,2.595,1.879,5.215,2.877,7.846
              c16.785,44.248,35.691,68.417,56.197,71.834c3.021,0.503,6.144,0.753,9.362,0.753c22.291-0.001,48.938-11.938,74.689-33.754
              c14.72-12.471,28.073-27.452,37.599-42.185c10.436-16.142,15.951-31.318,15.951-43.887c0-30.772-23.278-60.585-39.342-77.495
              h19.354c18.39,0,35.583-9.932,44.869-25.922c22.761-39.194,26.326-98.891,26.425-130.988
              C512.053,77.531,498.093,63.391,480.88,63.139z"
          />
        </g>
      </g>
    </SvgIcon>
  );
};

export default Logo;