/*
 *  Copyright 2020 Adobe
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

//@ts-nocheck
import React from 'react';

import universal from 'react-universal-component';

const withProps = (Component, props) => {
    return function (matchProps) {
        return <Component {...props} {...matchProps} />
    }
};

const ErrorMessage = () => {
    return (
        <div>Error loading chunks!</div>
    )
};

const ComponentBlockSkeleton = (props) => (
    <div className="loading-skeleton loading-skeleton__block" style={{height: props.skeletonHeight ? props.skeletonHeight : '50px'}}/>
);

const FallbackComponent = withProps(ComponentBlockSkeleton, {skeletonHeight: 1000});


export const withAsyncImport = (asyncImport,
                                loadingComponent = FallbackComponent) =>
    universal(asyncImport, {
        loading: loadingComponent,
        error: ErrorMessage
    });

export default withAsyncImport;
