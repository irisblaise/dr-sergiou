import React, {useEffect} from 'react';
import './brainAnimation.scss';
// @ts-ignore
import brain from './brain4.png'

// import Brainsvg from ''

const BrainAnimation = () => {
    function animationNeurolize(svgElements: any, animationDelay: number){
        svgElements.forEach((svgElement: any, index: number) => {
            const totalLength = svgElement.getTotalLength();
            svgElement.style.strokeDasharray = String(totalLength);
            svgElement.style.strokeDashoffset = String(totalLength);
            svgElement.style.animationDelay = `${animationDelay * index}s`;
        });
    }

    function neurolize() {
        const paths = document.querySelectorAll("path");
        const polylines = document.querySelectorAll("polyline");
        const circles = document.querySelectorAll("circle");
        const ellipses = document.querySelectorAll("ellipse");
        const lines = document.querySelectorAll("line");

        animationNeurolize(paths, -0.2);
        animationNeurolize(polylines, -0.4);
        animationNeurolize(circles, -0.6);
        animationNeurolize(ellipses, -0.1);
        animationNeurolize(lines, -0.8);


    }

    useEffect(() => {
        neurolize()
    },[neurolize()]);

    return (
        <div className="brainAnimation">
            <div className="wrapper">
                <div className="brain">

                    <svg className="brain__svg" version="1.1" x="0px" y="0px"
                         viewBox="0 0 595.28 841.89">
                        <g id="Layer_2">
                            <path className="st0" d="M359.5,493.01c11.2-14,11.2-14,11.2-14h26.33l17.92-17.36v-54.89"/>
                            <polyline className="st0"
                                      points="381.27,469.1 400.46,469.1 418.33,451.75 418.33,417.32 421.75,413.64 	"/>
                            <polyline className="st0"
                                      points="359.5,458.32 405.98,458.32 430.72,434.62 430.72,393.71 	"/>
                            <polyline className="st0"
                                      points="346.76,458.32 375.26,431.91 425.67,431.13 444.29,413.64 444.29,372 	"/>
                            <polyline className="st0"
                                      points="334.93,436.56 334.93,343.5 362.27,315.38 407.45,315.38 	"/>
                            <polyline className="st0"
                                      points="425.29,276.41 425.29,312.47 416.17,320.62 366.93,320.62 340.75,344.47 340.75,428.42 	"/>
                            <polyline className="st0"
                                      points="401.83,310.82 361.11,310.82 332.03,338.55 332.03,426.02 	"/>
                            <polyline className="st0"
                                      points="413.76,306.93 359.5,307.53 329.5,335.26 329.5,424.64 	"/>
                            <polyline className="st0" points="395.11,262.74 395.11,272.43 401.83,279.61 401.83,289.69 391.94,299.19 354.13,299.19
		315.93,335.06 315.93,357.36 307.21,368.42 306.43,428.42 	"/>
                            <polyline className="st0"
                                      points="389.22,270.3 398.34,280 398.34,288.53 389.22,296.86 352.77,296.86 313.22,334.09 313.22,360.8 	"/>
                            <polyline className="st0"
                                      points="385.54,289.5 379.33,294.54 352,294.54 310.7,332.15 310.7,364 	"/>
                            <polyline className="st0"
                                      points="376.23,274.76 376.23,287.56 346.76,287.56 305.46,328.47 303.91,430.55 	"/>
                            <polyline className="st0"
                                      points="366.93,291.44 348.7,291.44 307.98,330.41 307.21,368.42 	"/>
                            <polyline className="st0"
                                      points="370.22,283.87 344.43,283.87 302.94,324.98 301.39,421.92 	"/>
                            <polyline className="st0"
                                      points="354.13,278.45 338.62,278.45 294.6,323.04 294.6,432.19 	"/>
                            <polyline className="st0" points="301.39,310.82 280.77,329.93 280.77,426.02 	"/>
                            <polyline className="st0" points="301.39,306.56 280.77,326.75 280.77,428.42 	"/>
                            <polyline className="st0"
                                      points="242.5,649.83 219.82,628.62 219.82,615.8 215.41,611.39 215.41,554.69 	"/>
                            <polyline className="st0"
                                      points="242.5,642.27 224.65,627.15 224.65,613.49 218.56,608.03 218.56,567.29 	"/>
                            <polyline className="st0" points="211,669.15 211,657.6 211,566.03 	"/>
                            <polyline className="st0" points="196.72,552.59 196.72,643.74 211,657.6 	"/>
                            <polyline className="st0"
                                      points="208.69,565.19 200.08,572.12 200.08,636.81 211,647.1 	"/>
                            <polyline className="st0" points="202.39,557 202.39,633.87 211,642.27 	"/>
                            <polyline className="st0"
                                      points="174.67,643.95 174.67,592.07 187.48,579.26 187.48,533.69 	"/>
                            <polyline className="st0"
                                      points="157.87,616.43 157.87,582.2 179.92,558.89 179.92,537.05 192.52,525.92 	"/>
                            <polyline className="st0"
                                      points="205.54,520.04 183.07,538.73 183.07,561.41 164.8,579.68 164.94,600.37 157.87,606.14 	"/>
                            <polyline className="st0"
                                      points="155.24,617.08 150.8,614.03 150.8,583.84 176.99,557.91 176.99,536.08 194.83,520.04 	"/>
                            <polyline className="st0"
                                      points="69.8,372 69.8,413.64 88.55,430.55 140.18,432.19 179.91,471.51 179.91,483.88 201.86,503.85 	"/>
                            <polyline className="st0" points="82.73,394.29 82.73,435.04 107.31,458.8 158.3,459.63 174.3,475.3 174.3,493.62 197.87,512.85
		172.82,534.25 172.82,557 147.15,582.28 147.15,625.78 143.23,622.38 143.23,580.88 169.25,555.74 168.9,532.86 192.52,512.85 	"/>
                            <polyline className="st0" points="91.14,413.76 95.93,418.21 95.93,453.03 112.92,468.87 151.86,468.87 162.59,480.25 162.59,494.61
		211,540.64 	"/>
                            <polyline className="st0"
                                      points="98.73,406.33 98.73,461.94 117.71,480.42 142.46,480.42 206.7,544.11 	"/>
                            <polyline className="st0"
                                      points="156.81,406.33 156.81,412.6 150.21,418.38 150.21,424.81 184.37,457.98 184.37,520.04 	"/>
                            <polyline className="st0" points="158.63,426.79 187.01,456.16 187.48,518.28 	"/>
                            <polyline className="st0"
                                      points="166.22,417.39 166.22,430.75 192.45,456.33 192.45,495.29 	"/>
                            <polyline className="st0"
                                      points="166.22,398.41 166.22,403.03 173.05,409.3 173.05,434.05 195.75,456.34 195.75,494.11 	"/>
                            <polyline className="st0"
                                      points="175.62,408.97 175.62,417.39 179.34,420.85 179.34,435.54 198.56,454.02 197.87,494.11 	"/>
                            <polyline className="st0" points="189.98,436.69 201.86,445.6 201.86,494.11 	"/>
                            <polyline className="st0" points="177.6,388.68 177.6,393.46 185.69,400.89 185.69,405.01 180.99,408.97 180.99,416.4 206.7,441.97
		206.7,478.6 	"/>
                            <polyline className="st0"
                                      points="187.48,394.95 189.98,396.76 189.98,406.33 221,437.92 221,502.03 	"/>
                            <polyline className="st0" points="189.98,415.74 214.4,440.32 213.74,494.11 	"/>
                            <polyline className="st0" points="224.45,415.74 234.47,424.64 234.47,523.71 	"/>
                            <polyline className="st0" points="224.45,426.79 228.03,430.55 228.03,516.56 	"/>
                            <line className="st0" x1="224.45" y1="433.64" x2="224.45" y2="515.37"/>
                            <polyline className="st0" points="230.89,516.56 230.89,388.68 239.24,381.58 	"/>
                            <line className="st0" x1="224.45" y1="411.39" x2="248.78" y2="432.19"/>
                            <line className="st0" x1="218.49" y1="387.06" x2="230.89" y2="398.41"/>
                            <polyline className="st0"
                                      points="194.4,340.32 194.4,385.87 212.77,403.76 212.77,429.54 	"/>
                            <line className="st0" x1="201.86" y1="399.7" x2="212.77" y2="408.97"/>
                            <polyline className="st0" points="190.77,354.78 196.66,354.78 203.58,361.6 203.58,367.49 198.51,372 201.86,375.35 201.86,385.75
		"/>
                            <polyline className="st0" points="198.56,389.92 198.51,372 194.4,367.72 	"/>
                            <polyline className="st0"
                                      points="192.15,387.94 192.15,370.26 178.52,357.32 178.52,351.08 180.99,348.77 	"/>
                            <polyline className="st0"
                                      points="197.17,344.61 205.9,344.61 212.14,350.85 212.14,363.45 234.33,385.75 	"/>
                            <line className="st0" x1="217.23" y1="363.33" x2="237.46" y2="383.09"/>
                            <line className="st0" x1="204.29" y1="332.25" x2="204.29" y2="324.39"/>
                            <polyline className="st0" points="212.26,251.13 223.47,251.13 226.24,254.36 226.24,305.21 244.84,324.39 244.84,347.85
		236.29,355.32 	"/>
                            <polyline className="st0" points="213.41,272.97 216.77,272.97 216.77,282.79 220.69,286.84 220.69,303.94 241.15,324.39
		241.15,351.08 	"/>
                            <polyline className="st0"
                                      points="218.73,244.31 228.55,254.02 229.13,303.71 249.47,324.39 249.47,348.77 238.84,358.36 	"/>
                            <polyline className="st0" points="238.95,245.24 237.56,245.24 237.56,253.32 231.56,259.1 231.56,303.22 253.74,324.39 253.74,422.96
			"/>
                            <polyline className="st0"
                                      points="241.15,248.12 241.15,254.36 233.52,261.3 234.1,303.22 256.52,324.39 256.52,357.78 	"/>
                            <polyline className="st0" points="246.23,362.64 249.47,365.99 249.47,398.41 	"/>
                            <polyline className="st0" points="262.52,412.44 262.52,373.21 269,366.45 269,342.53 	"/>
                            <polyline className="st0"
                                      points="265.76,410.59 265.07,373.73 271.88,367.49 271.88,358.36 	"/>
                            <polyline className="st0"
                                      points="273.15,408.05 268.48,402.27 269,373.21 274.31,368.36 274.31,333.17 270.15,329.24 	"/>
                            <line className="st0" x1="286.67" y1="410.59" x2="286.67" y2="375.12"/>
                            <polyline className="st0"
                                      points="282.98,408.97 282.98,398.41 286.67,394.95 286.67,389.92 282.51,387.06 282.51,356.51 	"/>
                            <polyline className="st0" points="271.39,279.44 271.39,319.42 280.77,326.75 	"/>
                            <line className="st0" x1="263.82" y1="360.8" x2="263.82" y2="294.78"/>
                            <polyline className="st0"
                                      points="253.74,245.24 251.66,247.13 251.66,271.68 260.66,279.44 260.66,307.9 	"/>
                            <line className="st0" x1="253.74" y1="246.24" x2="253.74" y2="273.48"/>
                            <polyline className="st0"
                                      points="294.6,298.33 297.13,294.78 297.13,274.76 294.6,272.97 	"/>
                            <polyline className="st0" points="301.39,245.24 317.17,245.24 326.34,236.34 	"/>
                            <polyline className="st0"
                                      points="324.37,228.1 324.37,232.79 315.86,240.79 302.75,240.79 	"/>
                            <polyline className="st0" points="302.75,237.28 310.7,237.28 313.87,234.45 	"/>
                            <polyline className="st0" points="302.75,234.45 308.31,234.45 310.7,232.79 	"/>
                            <polyline className="st0" points="290.02,238.97 282.71,246.24 282.71,252.07 	"/>
                            <line className="st0" x1="287.77" y1="236.34" x2="280.77" y2="243.65"/>
                            <polyline className="st0"
                                      points="268.48,248.12 268.48,252.07 272.23,255.44 272.23,258.25 	"/>
                            <polyline className="st0"
                                      points="326.34,112.01 332.71,118 332.71,153.2 315.48,169.68 315.48,179.61 	"/>
                            <polyline className="st0"
                                      points="326.34,114.63 330.84,118.56 330.84,151.89 310.7,170.43 310.7,181.29 	"/>
                            <line className="st0" x1="324.1" y1="149.83" x2="305.75" y2="166.5"/>
                            <line className="st0" x1="324.1" y1="146.84" x2="305.75" y2="162.75"/>
                            <line className="st0" x1="313.56" y1="117.25" x2="324.37" y2="127.17"/>

                            <polyline className="st0"
                                      points="309.87,117.25 318.96,126.05 318.96,148.9 301.39,164.06 301.39,210.13 306.72,218.74 	"/>
                            <polyline className="st0" points="324.1,93.47 306.72,109.95 306.72,119.12 315.41,127.17 315.41,147.96 292.45,169.87 292.45,188.22
		287.77,191.21 287.77,202.26 284.27,204.32 	"/>
                            <polyline className="st0"
                                      points="301.39,185.97 303.77,183.93 305.75,182.23 305.75,170.99 324.37,154.51 	"/>
                            <line className="st0" x1="304.18" y1="214.18" x2="303.77" y2="183.93"/>
                            <line className="st0" x1="305.32" y1="157.59" x2="305.75" y2="182.23"/>
                            <polyline className="st0"
                                      points="317.74,194.29 315.48,196.26 305.75,196.26 300.49,200.44 	"/>
                            <path className="st0" d="M98.1,332.25"/>
                            <polyline className="st0"
                                      points="416.32,299.83 406.84,299.83 399.8,304.26 356.13,304.75 	"/>
                            <circle className="st1" cx="292.95" cy="271.59" r="2"/>
                            <circle className="st1" cx="408.84" cy="349.55" r="2"/>
                            <circle className="st1" cx="324.1" cy="226.1" r="2"/>
                            <circle className="st1" cx="356.13" cy="278.45" r="2"/>
                            <ellipse className="st1" cx="266.93" cy="330.89" rx="1.64" ry="1.47"/>
                            <circle className="st1" cx="263.82" cy="362.64" r="2"/>
                            <circle className="st1" cx="286.67" cy="373.21" r="2"/>
                            <circle className="st1" cx="204.29" cy="334.3" r="2"/>
                            <circle className="st1" cx="201.86" cy="388.22" r="2"/>
                            <circle className="st1" cx="415.19" cy="306.93" r="1.13"/>
                            <circle className="st1" cx="417.65" cy="299.83" r="1.13"/>
                            <circle className="st0" cx="444.29" cy="367.49" r="4"/>
                            <circle className="st0" cx="414.95" cy="403.23" r="4"/>
                            <circle className="st1" cx="430.72" cy="389.71" r="1.75"/>
                            <circle className="st0" cx="430.72" cy="389.71" r="3.5"/>

                            <ellipse transform="matrix(0.0709 -0.9975 0.9975 0.0709 121.0784 679.506)" className="st0"
                                     cx="425.29" cy="274.76" rx="2.51" ry="2.51"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="376.23" cy="272.25" rx="2.51" ry="2.47"/>
                            <circle className="st0" cx="386.78" cy="268.4" r="2.87"/>
                            <ellipse className="st0" cx="387.13" cy="288.12" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="328.32" cy="234.45" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="272.23" cy="260.73" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="282.71" cy="254.55" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="278.59" cy="245.65" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="281.96" cy="206.15" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="293.18" cy="183.41" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="294.6" cy="334.3" rx="2.51" ry="2.47"/>
                            <ellipse className="st0" cx="241.15" cy="336.07" rx="2.51" ry="2.47"/>
                            <circle className="st0" cx="183.89" cy="345.97" r="3.59"/>
                            <circle className="st0" cx="187.09" cy="354.66" r="3.94"/>
                            <circle className="st0" cx="177.6" cy="384.37" r="3.85"/>
                            <circle className="st0" cx="166.22" cy="413.76" r="3.85"/>
                            <circle className="st0" cx="155.93" cy="423.43" r="3.85"/>
                            <circle className="st0" cx="187.09" cy="412.43" r="3.85"/>
                            <circle className="st0" cx="187.09" cy="433.64" r="3.85"/>
                            <circle className="st0" cx="98.73" cy="402.48" r="3.85"/>
                            <circle className="st0" cx="69.8" cy="368.36" r="3.85"/>
                            <circle className="st0" cx="146.95" cy="630.45" r="3.85"/>
                            <circle className="st0" cx="211" cy="673" r="3.85"/>
                            <circle className="st0" cx="204.29" cy="320.89" r="3.08"/>
                            <circle className="st0" cx="403.9" cy="310.82" r="1.77"/>
                            <circle className="st0" cx="249.47" cy="402.62" r="3.85"/>
                            <ellipse className="st1" cx="88.53" cy="410.72" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="88.53" cy="410.72" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="82.73" cy="390.48" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="82.73" cy="390.48" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="156.79" cy="402.91" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="156.79" cy="402.91" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="166.38" cy="394.57" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="166.38" cy="394.57" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="175.62" cy="404.99" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="175.62" cy="404.99" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="184.95" cy="392.74" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="184.95" cy="392.74" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="194.4" cy="363.84" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="194.4" cy="363.84" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="194.4" cy="336.73" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="194.4" cy="336.73" rx="3.5" ry="3.59"/>
                            <circle className="st0" cx="216.87" cy="384.93" r="2.52"/>
                            <ellipse className="st1" cx="157.87" cy="619.79" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="157.87" cy="619.79" rx="3.5" ry="3.59"/>
                            <ellipse className="st1" cx="174.67" cy="647.54" rx="1.75" ry="1.8"/>
                            <ellipse className="st0" cx="174.67" cy="647.54" rx="3.5" ry="3.59"/>
                            <circle className="st0" cx="318.96" cy="193.12" r="1.94"/>
                            <circle className="st1" cx="424.39" cy="411.29" r="1.75"/>
                            <circle className="st0" cx="424.39" cy="411.29" r="3.5"/>
                            <circle className="st0" cx="293.6" cy="299.83" r="1.51"/>
                        </g>
                        <g id="Layer_1">
                            <polyline className="st2"
                                      points="374.85,573.84 385.12,584.38 385.12,607.35 381.33,612.21 	"/>
                            <polyline className="st2" points="385.12,571.4 390.52,578.43 390.52,586 	"/>
                            <polyline className="st2" points="390.52,619.51 397.82,612.21 397.82,580.32 	"/>
                            <polyline className="st2"
                                      points="429.71,650.23 429.71,634.9 423.23,629.78 423.23,599.92 426.47,597.73 	"/>
                            <polyline className="st2"
                                      points="434.03,632.75 434.03,639.73 438.41,645.18 438.41,666.53 	"/>
                            <polyline className="st2" points="426.47,685.99 431.34,681.4 431.34,673.29 	"/>
                            <polyline className="st2" points="379.98,711.94 379.98,683.56 374.85,675.99 374.85,655.2 364.58,646.27 364.58,628.97 357.55,622.75
		357.55,619.51 	"/>
                            <polyline className="st2"
                                      points="385.12,669.51 392.68,677.07 411.07,677.07 415.93,673.29 415.93,651.67 411.88,649.64 	"/>
                            <polyline className="st2"
                                      points="387.82,647.89 400.52,647.89 408.09,655.2 407.95,665.72 	"/>
                            <polyline className="st2" points="374.85,732.48 370.52,728.42 370.52,717.34 	"/>
                            <polyline className="st2" points="363.5,732.48 363.5,724.91 359.98,721.13 359.98,701.4 356.2,696.8 356.2,685.99 349.98,679.64
		349.98,650.23 353.5,647.89 352.96,619.51 	"/>
                            <line className="st2" x1="355.39" y1="724.91" x2="356.2" y2="696.8"/>
                            <polyline className="st2" points="308.89,759.5 312.69,755.72 312.69,748.42 	"/>
                            <polyline className="st2" points="318.63,764.1 318.63,740.59 312.69,734.37 312.69,708.42 322.96,696.8 322.96,647.89 329.56,642.46
		329.56,594.89 337.28,587.35 337.28,533.27 	"/>
                            <polyline className="st2" points="368.77,699.88 368.77,683.62 363.5,678.64 363.5,660.88 363.5,655.62 359.66,652.25 359.66,634.9
		353.13,628.85 	"/>
                            <polyline className="st2"
                                      points="358.99,664.37 358.99,684.28 362.98,687.12 362.98,691.42 	"/>
                            <polyline className="st2"
                                      points="344.9,696.89 344.9,689.92 339.25,684.77 339.25,657.72 	"/>
                            <polyline className="st2"
                                      points="338.93,710.49 338.93,692.63 333.29,687.15 333.3,662.92 	"/>
                            <polyline className="st2" points="344.06,729.26 344.06,720.8 348.04,717.34 	"/>
                            <polyline className="st2" points="366.63,746.36 362.98,742.21 341.4,742.21 333.6,734.57 333.6,719.97 330.28,716.32 322.98,716.32
		319.99,718.8 319.99,736.9 324.14,740.05 	"/>
                            <polyline className="st2" points="319.33,710.86 324.14,706.52 331.11,706.52 	"/>
                            <line className="st2" x1="404.47" y1="638.31" x2="379.98" y2="638.31"/>
                            <line className="st2" x1="344.89" y1="653.89" x2="344.89" y2="670.84"/>
                            <line className="st2" x1="323.44" y1="670.84" x2="349.98" y2="650.23"/>
                            <polyline className="st2"
                                      points="333.29,663.19 333.6,651.42 342.07,644.04 342.07,634.69 	"/>
                            <polyline className="st2" points="339.24,658.57 339.24,651.66 347.79,645.02 347.79,619.51 342.07,628.17 342.07,634.69
		327.99,650.23 327.99,682.17 	"/>
                            <polyline className="st2"
                                      points="364.66,604.78 364.66,612.21 369.79,617.28 369.79,639.41 	"/>
                            <polyline className="st2"
                                      points="368.77,586 373,589.19 373,622.1 379.09,627.71 368.77,644.71 	"/>
                            <polyline className="st2" points="300.3,675.99 300.3,661.88 308.89,655.2 	"/>
                            <polyline className="st2"
                                      points="323.44,540.19 323.44,586 317.53,591.21 317.53,641.01 308.89,647.89 	"/>
                            <line className="st2" x1="337.28" y1="612.21" x2="337.28" y2="647.89"/>
                            <line className="st2" x1="344.89" y1="580.32" x2="344.89" y2="624.15"/>
                            <line className="st2" x1="339.24" y1="595.79" x2="344.89" y2="590.78"/>
                            <polyline className="st2"
                                      points="227.5,200.73 234.28,207.09 234.28,212.5 234.28,215.46 238.21,219.7 	"/>
                            <line className="st2" x1="238.21" y1="205.78" x2="230.28" y2="197.74"/>
                            <polyline className="st2"
                                      points="252.69,205.78 248.41,200.73 238.21,200.73 232.46,195.92 	"/>
                            <polyline className="st2"
                                      points="264.55,328.19 254.46,317.6 232.46,317.6 224.43,324.49 224.43,337.72 	"/>
                            <polyline className="st2" points="267.01,346.15 261.47,340 247.14,340 236.75,349.6 	"/>
                            <line className="st2" x1="241.17" y1="340" x2="233.28" y2="346.25"/>
                            <line className="st2" x1="234.25" y1="335.82" x2="234.25" y2="349.6"/>
                            <line className="st2" x1="272.67" y1="369.29" x2="241.32" y2="369.29"/>
                            <polyline className="st2" points="281.53,398.83 281.53,391.94 272.67,383.07 	"/>
                            <line className="st2" x1="255.02" y1="278.26" x2="255.02" y2="254.75"/>
                            <polyline className="st2" points="262.62,282.06 262.62,243.35 266.42,239.55 	"/>
                            <line className="st2" x1="312.81" y1="195.05" x2="323.31" y2="185.1"/>
                            <polyline className="st2" points="300.33,205.78 304.69,201.76 315.32,201.76 	"/>
                            <polyline className="st2"
                                      points="323.31,159.59 329.78,164.65 329.78,192.03 300.33,220.55 	"/>
                            <polyline className="st2" points="344.31,234.66 350.03,239.72 350.03,249.75 350.03,263.62 347.06,266.51 337.1,266.51 332.82,262.48
		332.82,254.75 	"/>
                            <polyline className="st2"
                                      points="281.66,168.94 276.21,172.88 275.85,212.1 300.33,237.83 	"/>
                            <path className="st3" d="M446.48,634.47l-11.72-10.9v-63.38l3.78-6.62l-1.74-0.99l-4.04,7.08v64.78l11.72,10.9v36l-8.73,7.53
		l0.31,10.26l-5.07,5.06c-0.93-0.62-2.05-0.98-3.26-0.98c-3.26,0-5.92,2.66-5.92,5.92s2.66,5.92,5.92,5.92s5.92-2.66,5.92-5.92
		c0-1.34-0.45-2.57-1.21-3.57l5.64-5.63l-0.31-10.18l8.71-7.51V634.47z M427.73,703.05c-2.16,0-3.92-1.76-3.92-3.92
		s1.76-3.92,3.92-3.92s3.92,1.76,3.92,3.92S429.89,703.05,427.73,703.05z"/>
                            <circle className="st2" cx="379.98" cy="714.2" r="2.26"/>
                            <path className="st3" d="M419.23,633.94v-39.05h-4v40.97l6.01,4.83v37.77l-6.93,6.66h-18.8c-0.28-0.54-0.68-1.04-1.18-1.45
		c-0.97-0.79-2.21-1.19-3.5-1.11c-1.29,0.08-2.48,0.61-3.34,1.51c-0.89,0.92-1.34,2.11-1.27,3.35c0.14,2.42,2.28,4.29,4.84,4.29
		c0.1,0,0.21,0,0.31-0.01c1.29-0.08,2.48-0.61,3.34-1.51c0.31-0.33,0.55-0.69,0.75-1.08h20.45l9.31-8.96v-41.39L419.23,633.94z
		 M393.27,688.81c-0.52,0.54-1.24,0.86-2.02,0.91c-1.59,0.1-2.95-0.98-3.04-2.4c-0.04-0.67,0.21-1.33,0.71-1.84
		c0.52-0.54,1.24-0.86,2.02-0.91c0.07,0,0.13-0.01,0.2-0.01c0.71,0,1.39,0.23,1.92,0.67c0.55,0.45,0.88,1.07,0.92,1.74
		C394.02,687.64,393.77,688.29,393.27,688.81z"/>
                            <circle className="st2" cx="269.3" cy="165.79" r="3.15"/>
                            <circle className="st2" cx="283.86" cy="166.13" r="3.15"/>
                            <path className="st6" d="M273.37,181.05c0-2.01-1.64-3.65-3.65-3.65s-3.65,1.64-3.65,3.65c0,1.84,1.38,3.35,3.15,3.6v32.58
		l-11.77,12.25h-4.99l-5.59,6.62l1.44,50.47l3.88,3.44v13.1h-4.32V289.7l-14.09-12.68v-42.85l6.48-4.8h5.29l3.36-3.11v-6.36
		l3.99-4.19h5.7l3.37-3.24v-39.76l-3.14-4.03c0.64-0.66,1.04-1.56,1.04-2.55c0-2.01-1.64-3.65-3.65-3.65s-3.65,1.64-3.65,3.65
		s1.64,3.65,3.65,3.65c0.66,0,1.27-0.19,1.81-0.5l2.94,3.77v39l-2.77,2.66h-5.72l-4.57,4.79v6.32l-2.76,2.55h-5.23l-7.15,5.3v43.79
		l14.09,12.68v12.98h-20.93l-10.13,10.35v54.22l7.38,6.74v49.76l-11.07,9.53v24.92h1v-24.46l11.07-9.53v-50.66l-7.38-6.74v-53.38
		l9.55-9.75h26.2c0.25,2.51,2.36,4.48,4.93,4.48c2.75,0,4.98-2.23,4.98-4.98s-2.23-4.98-4.98-4.98c-1.84,0-3.44,1.02-4.3,2.51
		v-11.59l-3.9-3.46l-1.42-49.65l5.05-5.98h4.95l12.35-12.85v-32.98C271.99,184.4,273.37,182.89,273.37,181.05z M253.57,166.13
		c0-1.46,1.19-2.65,2.65-2.65c1.46,0,2.65,1.19,2.65,2.65s-1.19,2.65-2.65,2.65C254.76,168.78,253.57,167.59,253.57,166.13z
		 M257.49,300.64c1.64,0,2.98,1.34,2.98,2.98s-1.34,2.98-2.98,2.98c-1.64,0-2.98-1.34-2.98-2.98S255.85,300.64,257.49,300.64z
		 M269.72,183.7c-1.46,0-2.65-1.19-2.65-2.65s1.19-2.65,2.65-2.65c1.46,0,2.65,1.19,2.65,2.65S271.18,183.7,269.72,183.7z"/>
                            <circle className="st2" cx="255.25" cy="180.34" r="3.15"/>
                            <circle className="st2" cx="241.17" cy="180.34" r="3.15"/>
                            <path className="st3" d="M255.27,190.51c-0.96,0-1.82,0.38-2.47,0.98l-3.89-2.79v-11.36l-6.82-6.36v-13.02h-1v13.46l6.82,6.36v11.44
		l4.25,3.05c-0.34,0.55-0.54,1.2-0.54,1.89c0,2.01,1.64,3.65,3.65,3.65s3.65-1.64,3.65-3.65S257.28,190.51,255.27,190.51z
		 M255.27,196.81c-1.46,0-2.65-1.19-2.65-2.65c0-1.46,1.19-2.65,2.65-2.65s2.65,1.19,2.65,2.65
		C257.92,195.62,256.73,196.81,255.27,196.81z"/>
                            <circle className="st2" cx="241.17" cy="194.59" r="3.15"/>
                            <circle className="st2" cx="255.25" cy="208.55" r="3.15"/>
                            <circle className="st2" cx="240.72" cy="208.55" r="3.15"/>
                            <circle className="st2" cx="240.72" cy="222.51" r="3.15"/>
                            <circle className="st2" cx="255.27" cy="222.94" r="3.15"/>
                            <circle className="st2" cx="241.17" cy="236.79" r="3.15"/>
                            <circle className="st2" cx="255.02" cy="236.79" r="3.15"/>
                            <circle className="st2" cx="268.99" cy="237.25" r="3.15"/>
                            <circle className="st2" cx="255.02" cy="251.59" r="3.15"/>
                            <circle className="st2" cx="298.19" cy="208.11" r="3.15"/>
                            <circle className="st2" cx="297.41" cy="194.97" r="3.15"/>
                            <circle className="st2" cx="297.41" cy="180.34" r="3.15"/>
                            <circle className="st2" cx="284.87" cy="144.59" r="1.75"/>
                            <circle className="st2" cx="298.88" cy="130.75" r="3.02"/>
                            <circle className="st2" cx="292.39" cy="127.66" r="1.37"/>
                            <path className="st3" d="M311.61,177.12v-36.84l-4.71-4.74v-7.46c0.78-0.22,1.36-0.93,1.36-1.78c0-1.03-0.83-1.86-1.86-1.86
		s-1.86,0.83-1.86,1.86c0,0.85,0.58,1.56,1.36,1.78v7.87l4.71,4.74v36.42c-1.77,0.25-3.15,1.76-3.15,3.6c0,2.01,1.64,3.65,3.65,3.65
		s3.65-1.64,3.65-3.65C314.76,178.88,313.38,177.37,311.61,177.12z M305.54,126.3c0-0.47,0.39-0.86,0.86-0.86
		c0.47,0,0.86,0.39,0.86,0.86s-0.39,0.86-0.86,0.86C305.93,127.16,305.54,126.77,305.54,126.3z M311.11,183.37
		c-1.46,0-2.65-1.19-2.65-2.65s1.19-2.65,2.65-2.65c1.46,0,2.65,1.19,2.65,2.65S312.57,183.37,311.11,183.37z"/>
                            <path className="st3" d="M379.31,320.97c0-1.44-1.17-2.61-2.61-2.61c-1.44,0-2.61,1.17-2.61,2.61c0,1.27,0.91,2.33,2.11,2.56v13.95
		l-6.56,5.41v15.95l-10.47,8.49v63.16h1v-62.68l10.47-8.49v-15.95l6.56-5.41v-14.43C378.4,323.29,379.31,322.24,379.31,320.97z"/>
                            <circle className="st2" cx="343.03" cy="233.09" r="2.02"/>
                            <g>
                                <circle className="st2" cx="367.73" cy="206.75" r="2.36"/>
                                <g>
                                    <polyline className="st2"
                                              points="366.4,208.67 360.22,215.31 360.22,225.21 			"/>
                                    <circle className="st1" cx="360.22" cy="226.76" r="2.11"/>
                                </g>
                            </g>
                            <circle className="st2" cx="311.03" cy="196.35" r="2.16"/>
                            <g>
                                <polyline className="st2"
                                          points="332.82,159.59 332.82,192.88 318.06,205.78 318.06,212.41 313.87,216.42 300.33,216.83 		"/>
                                <circle className="st2" cx="332.82" cy="158.46" r="1.22"/>
                            </g>
                            <g>
                                <polyline className="st2"
                                          points="336.61,152.75 336.61,195.23 322.74,207.95 322.74,212.31 313.97,220.85 		"/>
                                <circle className="st2" cx="312.45" cy="223.14" r="2.75"/>
                                <circle className="st2" cx="336.61" cy="151.53" r="1.22"/>
                            </g>
                            <path className="st3" d="M298.04,162.53v-14.75l-10.83-9.58v-13.87l3.59-3.62v-11.13c0.75-0.24,1.3-0.94,1.3-1.77
		c0-1.03-0.84-1.87-1.87-1.87s-1.87,0.84-1.87,1.87c0,0.88,0.62,1.62,1.44,1.82v10.68l-3.59,3.62v14.73l10.83,9.58v14.3
		c-1.77,0.25-3.15,1.76-3.15,3.6c0,2.01,1.64,3.65,3.65,3.65s3.65-1.64,3.65-3.65C301.19,164.29,299.81,162.78,298.04,162.53z
		 M289.36,107.81c0-0.48,0.39-0.87,0.87-0.87s0.87,0.39,0.87,0.87c0,0.48-0.39,0.87-0.87,0.87S289.36,108.29,289.36,107.81z
		 M297.54,168.78c-1.46,0-2.65-1.19-2.65-2.65s1.19-2.65,2.65-2.65c1.46,0,2.65,1.19,2.65,2.65S299,168.78,297.54,168.78z"/>
                            <circle className="st1" cx="429.71" cy="651.36" r="1.28"/>
                            <circle className="st1" cx="434.03" cy="631.7" r="1.28"/>
                            <circle className="st1" cx="426.47" cy="597.73" r="1.28"/>
                            <circle className="st1" cx="390.52" cy="619.51" r="1.28"/>
                            <circle className="st1" cx="381.12" cy="612.85" r="1.28"/>
                            <circle className="st1" cx="390.52" cy="586.82" r="1.28"/>
                            <circle className="st1" cx="368.77" cy="585.69" r="1.28"/>
                            <circle className="st1" cx="379.61" cy="638.31" r="1.28"/>
                            <circle className="st1" cx="387.48" cy="647.89" r="1.28"/>
                            <circle className="st1" cx="408.09" cy="665.72" r="1.28"/>
                            <circle className="st1" cx="340.38" cy="594.68" r="1.28"/>
                            <circle className="st1" cx="337.22" cy="611.66" r="1.28"/>
                            <circle className="st1" cx="364.66" cy="604.56" r="1.28"/>
                            <circle className="st1" cx="327.99" cy="682.66" r="1.28"/>
                            <circle className="st1" cx="319.15" cy="711.18" r="0.64"/>
                            <circle className="st1" cx="312.69" cy="748.42" r="1.28"/>
                            <circle className="st1" cx="366.63" cy="746.36" r="1.28"/>
                            <circle className="st1" cx="344.06" cy="730.06" r="1.28"/>
                            <circle className="st1" cx="355.39" cy="725.77" r="1.28"/>
                            <circle className="st1" cx="344.7" cy="698.59" r="1.28"/>
                            <circle className="st2" cx="376" cy="734.23" r="2.26"/>
                            <circle className="st2" cx="313.08" cy="765.08" r="2.26"/>
                            <circle className="st2" cx="325.61" cy="741.17" r="2.26"/>
                            <circle className="st2" cx="349.25" cy="716.73" r="1.55"/>
                            <circle className="st2" cx="332.35" cy="706.52" r="1.55"/>
                            <circle className="st2" cx="338.93" cy="712.04" r="1.55"/>
                            <circle className="st2" cx="363.5" cy="734.02" r="1.55"/>
                            <circle className="st2" cx="384.55" cy="668.63" r="1.55"/>
                            <circle className="st2" cx="410.94" cy="649.34" r="1.55"/>
                            <circle className="st2" cx="425.43" cy="686.7" r="1.55"/>
                            <circle className="st1" cx="431.39" cy="672.65" r="1.28"/>
                            <circle className="st2" cx="438.41" cy="668.08" r="1.55"/>
                            <circle className="st2" cx="362.98" cy="692.38" r="1.55"/>
                            <circle className="st1" cx="368.77" cy="701.05" r="1.28"/>
                            <circle className="st2" cx="300.3" cy="677.07" r="1.55"/>
                            <circle className="st2" cx="344.89" cy="672.05" r="1.55"/>
                            <circle className="st1" cx="302.53" cy="759.12" r="1.28"/>
                            <g>
                                <path className="st3" d="M265.5,110.71c-1.03,0-1.87-0.84-1.87-1.87s0.84-1.87,1.87-1.87s1.87,0.84,1.87,1.87
			S266.53,110.71,265.5,110.71z M265.5,107.97c-0.48,0-0.87,0.39-0.87,0.87s0.39,0.87,0.87,0.87s0.87-0.39,0.87-0.87
			S265.98,107.97,265.5,107.97z"/>
                            </g>
                            <circle className="st2" cx="234.25" cy="334.12" r="1.75"/>
                            <circle className="st2" cx="266.93" cy="330.89" r="3.22"/>
                            <circle className="st2" cx="268.8" cy="347.89" r="2.99"/>
                            <circle className="st1" cx="286.28" cy="285.13" r="2.11"/>
                            <circle className="st2" cx="312.81" cy="270.04" r="2.75"/>
                            <circle className="st2" cx="270.34" cy="266.37" r="4.71"/>
                            <line className="st2" x1="255.25" y1="243.67" x2="255.21" y2="239.93"/>
                            <line className="st2" x1="263.29" y1="236.6" x2="258.17" y2="236.6"/>
                            <line className="st2" x1="262.62" y1="252.32" x2="270.06" y2="261.67"/>
                            <g>
                                <circle className="st1" cx="283.76" cy="267.93" r="2.11"/>
                                <line className="st2" x1="283.76" y1="265.83" x2="283.76" y2="249.85"/>
                            </g>
                            <g>
                                <polyline className="st2"
                                          points="353.07,203.77 353.07,235.24 361.02,241.76 361.02,249.75 		"/>
                                <circle className="st2" cx="353.07" cy="199.67" r="4"/>
                            </g>
                            <circle className="st2" cx="262.62" cy="284.04" r="1.85"/>
                            <circle className="st2" cx="254.94" cy="279.55" r="1.22"/>
                            <path className="st3" d="M207.5,284.4c-2.75,0-4.98,2.23-4.98,4.98c0,1.45,0.64,2.75,1.63,3.66l-6.82,6.94l0.12-11.93
		c1.07-0.28,1.87-1.25,1.87-2.41c0-1.38-1.12-2.5-2.5-2.5s-2.5,1.12-2.5,2.5c0,1.25,0.93,2.28,2.13,2.46l-0.26,25.7l-10.24,9.04
		l-1.1,51.48l0,0.22l13.83,13.27v81.39h1V387.4l-13.83-13.27l1.09-50.82l10.24-9.04l0.13-12.84l7.65-7.78
		c0.75,0.44,1.61,0.72,2.53,0.72c2.75,0,4.98-2.23,4.98-4.98S210.25,284.4,207.5,284.4z M207.5,292.36c-1.64,0-2.98-1.34-2.98-2.98
		s1.34-2.98,2.98-2.98s2.98,1.34,2.98,2.98S209.14,292.36,207.5,292.36z"/>
                            <path className="st3" d="M262.3,87.25c0-1.03-0.84-1.87-1.87-1.87c-1.03,0-1.87,0.84-1.87,1.87c0,0.86,0.58,1.57,1.37,1.79v12.84
		l-1.99,2.29v25.31h1v-24.93l1.99-2.29V89.04C261.72,88.82,262.3,88.11,262.3,87.25z M260.43,88.12c-0.48,0-0.87-0.39-0.87-0.87
		c0-0.48,0.39-0.87,0.87-0.87c0.48,0,0.87,0.39,0.87,0.87C261.3,87.73,260.91,88.12,260.43,88.12z"/>
                            <path className="st3" d="M267.37,80.74c0-1.03-0.84-1.87-1.87-1.87s-1.87,0.84-1.87,1.87c0,0.86,0.58,1.57,1.37,1.79v20.84l-3,2.62
		v23.3h1v-22.84l3-2.62V82.53C266.79,82.31,267.37,81.6,267.37,80.74z M265.5,81.61c-0.48,0-0.87-0.39-0.87-0.87
		s0.39-0.87,0.87-0.87s0.87,0.39,0.87,0.87S265.98,81.61,265.5,81.61z"/>
                            <g>

                                <rect x="265.21" y="110.19"
                                      transform="matrix(0.9998 -0.0209 0.0209 0.9998 -2.4619 5.5847)" className="st3"
                                      width="1" height="20.56"/>
                            </g>
                            <path className="st3" d="M278.08,99.81c0-1.03-0.84-1.87-1.87-1.87s-1.87,0.84-1.87,1.87c0,0.86,0.58,1.57,1.37,1.79v5.33l-6.49,4.59
		v22.76h1v-22.24l6.49-4.59v-5.85C277.5,101.38,278.08,100.67,278.08,99.81z M276.21,100.68c-0.48,0-0.87-0.39-0.87-0.87
		c0-0.48,0.39-0.87,0.87-0.87s0.87,0.39,0.87,0.87C277.08,100.29,276.69,100.68,276.21,100.68z"/>
                            <path className="st3" d="M257.14,100.79c0-1.03-0.84-1.87-1.87-1.87s-1.87,0.84-1.87,1.87c0,0.86,0.58,1.57,1.37,1.79l-0.34,28.16
		l1,0.01l0.34-28.17C256.56,102.36,257.14,101.65,257.14,100.79z M255.27,101.66c-0.48,0-0.87-0.39-0.87-0.87
		c0-0.48,0.39-0.87,0.87-0.87s0.87,0.39,0.87,0.87C256.14,101.27,255.75,101.66,255.27,101.66z"/>
                            <path className="st3" d="M254.62,91.97c-1.03,0-1.87,0.84-1.87,1.87c0,0.27,0.06,0.53,0.16,0.76l-4.12,3.16v6.02l2.19,2.62v27.42h1
		v-27.78l-2.19-2.62v-5.16l3.76-2.89c0.3,0.21,0.67,0.34,1.07,0.34c1.03,0,1.87-0.84,1.87-1.87S255.65,91.97,254.62,91.97z
		 M254.62,94.71c-0.48,0-0.87-0.39-0.87-0.87s0.39-0.87,0.87-0.87s0.87,0.39,0.87,0.87S255.1,94.71,254.62,94.71z"/>
                            <path className="st2" d="M290.23,107.81"/>
                            <polyline className="st4" points="264,150.98 264,161.5 266.83,163.83 	"/>
                            <g>
                                <path className="st3" d="M390.87,227.15c-1.44,0-2.61,1.17-2.61,2.61c0,0.53,0.16,1.02,0.43,1.43l-8.86,8.32v41.37l-17.02,16.17V357
			l-8.58,9.51l-1.65,59.65l1,0.03l1.64-59.29l8.59-9.53v-59.91l17.02-16.17v-41.37l8.56-8.03c0.42,0.29,0.93,0.47,1.48,0.47
			c1.44,0,2.61-1.17,2.61-2.61S392.31,227.15,390.87,227.15z"/>
                                <path className="st3" d="M299.76,349.35l-4.46-3.46v-7.48l4.74-4.07l0.21-23.53l-6.76-7.39v-4.51c1.21-0.23,2.13-1.3,2.13-2.58
			c0-1.45-1.18-2.63-2.63-2.63s-2.63,1.18-2.63,2.63c0,1.28,0.92,2.34,2.13,2.58v4.89l6.76,7.39l-0.21,22.69l-4.74,4.07v8.42
			l4.46,3.46v24.22l8.72,6.69v24.08h1v-24.58l-8.72-6.69V349.35z M291.36,296.34c0-0.9,0.73-1.63,1.63-1.63s1.63,0.73,1.63,1.63
			s-0.73,1.63-1.63,1.63S291.36,297.24,291.36,296.34z"/>
                            </g>
                            <path className="st5" d="M368.51,187.19c0.47-1.04,0.74-2.19,0.74-3.4c0-4.54-3.69-8.23-8.23-8.23s-8.23,3.69-8.23,8.23
		s3.69,8.23,8.23,8.23c1.12,0,2.19-0.23,3.17-0.64l10.91,9.75v26.4l-7.96,7.96v42.32l-15.42,15.4v62.48l-7.19,6.01l-21.32-19.87
		l-1.46-22.8l-18.42-17.45v-83.14L327,195.28V65.38h-0.01c1.95-0.97,3.3-2.98,3.3-5.3c0-3.26-2.66-5.92-5.92-5.92
		s-5.92,2.66-5.92,5.92c0,2.32,1.35,4.33,3.3,5.3H321v127.38l-23.67,23.15v88.24l18.58,17.61l1.46,22.82l26.69,24.87v57.52
		l-8.04,9.7v16.4h6v-14.24l8.04-9.7v-64.25l7.66-6.4v-62.8l15.42-15.4v-42.32l7.96-7.96v-31.56L368.51,187.19z M356.79,183.79
		c0-2.33,1.9-4.23,4.23-4.23c2.33,0,4.23,1.9,4.23,4.23s-1.9,4.23-4.23,4.23C358.69,188.02,356.79,186.12,356.79,183.79z
		 M320.45,60.08c0-2.16,1.76-3.92,3.92-3.92c2.16,0,3.92,1.76,3.92,3.92S326.53,64,324.37,64C322.21,64,320.45,62.24,320.45,60.08z"
                            />
                            <path className="st5" d="M260.43,127.97c-7.52,0-13.64,6.12-13.64,13.64c0,2.02,0.45,3.93,1.25,5.66l-17.53,16.14v28.94l-24.06,25.87
		v107l31.49,30.38l-1.35,159.58l7,0.06l1.37-162.58l-31.51-30.4V220.98l24.06-25.87v-28.62l14.98-13.8
		c2.24,1.61,4.97,2.57,7.94,2.57c7.52,0,13.64-6.12,13.64-13.64S267.95,127.97,260.43,127.97z M260.43,150.25
		c-4.76,0-8.64-3.88-8.64-8.64s3.88-8.64,8.64-8.64s8.64,3.88,8.64,8.64S265.19,150.25,260.43,150.25z"/>
                            <path className="st5" d="M383.91,246.25l-40.38-0.52c-0.91-4.76-4.72-8.36-9.32-8.42c-5.33-0.07-9.74,4.65-9.81,10.52
		s4.2,10.71,9.54,10.77c3.91,0.05,7.31-2.48,8.88-6.14l0,0.25l38.71,0.5l15.28,16.41l-1.19,91.67l-3.87,11.83l-6.14,5.75
		l-0.61,24.03l-0.15,0l-0.16,12.21l0,0.02h0l-0.74,57.28l6,0.08l0.74-57.19l0.83-32.99l5.24-4.91l4.84-14.77l1.24-96.03
		L383.91,246.25z M333.98,254.6c-3.44-0.04-6.2-3.06-6.16-6.73c0.05-3.67,2.89-6.61,6.33-6.57c3.44,0.04,6.21,3.06,6.16,6.73
		C340.26,251.7,337.42,254.65,333.98,254.6z"/>
                            <g id="i9WKa8.tif">
                                <image width="1509" height="1972" id="Layer_1" overflow="visible"
                                       transform="matrix(-0.1805 0 0 -0.1772 451.9308 736.6599)" href={brain}></image>
                            </g>
                            <path className="st5" d="M326.53,535.6v50.57l-6.77,6.31v49.02l-5.97,5.94v47.24l-12.18,11.36v32.75l-7.05,5.95v23.72l7.56,6.83
		c-5.08,1.26-8.85,5.67-8.85,10.9c0,6.22,5.31,11.28,11.83,11.28c6.52,0,11.83-5.06,11.83-11.28c0-5.17-3.67-9.53-8.66-10.86
		l-9.52-8.59v-20.2l7.05-5.95v-32.87l12.18-11.36v-47.32l5.97-5.94v-48.94l6.77-6.31V535.6H326.53z M312.73,786.19
		c0,4.01-3.42,7.28-7.63,7.28c-4.21,0-7.63-3.27-7.63-7.28s3.42-7.28,7.63-7.28C309.31,778.91,312.73,782.17,312.73,786.19z"/>
                            <path className="st5" d="M289.96,443.6l-6.36,0l0,3.6l-0.01,0l0.04,138.57l20.8,21.34l-0.3,76.45l-17.44,24.1l-2.18,19.38l-5.91,3.47
		c-1.52-0.85-3.25-1.33-5.08-1.34c-6.01-0.02-10.91,5.05-10.94,11.3s4.84,11.36,10.85,11.39c6.01,0.02,10.91-5.05,10.94-11.3
		c0.01-1.93-0.45-3.76-1.27-5.35l7.19-5.95l1.83-18.77l17.78-25.51l0.91-80.63L289.99,583L289.96,443.6z M273.45,748.08
		c-4-0.02-7.25-3.42-7.23-7.59c0.02-4.17,3.29-7.55,7.29-7.53c1.69,0.01,3.24,0.62,4.47,1.64l1.5,1.67c0.8,1.22,1.27,2.69,1.26,4.28
		C280.72,744.72,277.45,748.1,273.45,748.08z"/>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}
export default BrainAnimation;

