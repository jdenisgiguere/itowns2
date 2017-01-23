/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import ApiGlobe from './Core/Commander/Interfaces/ApiInterface/ApiGlobe';
import { addOBBLayer } from './Renderer/ThreeExtended/OBBHelper';

// browser execution or not ?
const scope = typeof window !== 'undefined' ? window : {};
const itowns = scope.itowns || {
    viewer: new ApiGlobe(),
    // debug
    obb: {
        addHelper: addOBBLayer,
    },
};
scope.itowns = itowns;
export const viewer = itowns.viewer;
export const obb = itowns.obb;
export default scope.itowns;
