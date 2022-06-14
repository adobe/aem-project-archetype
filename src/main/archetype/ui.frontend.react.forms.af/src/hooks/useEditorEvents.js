/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
import { useEffect, useState } from 'react';

export const cookieValue = cookieName => {
    let b = document.cookie.match(`(^|[^;]+)\\s*${cookieName}\\s*=\\s*([^;]+)`);
    return b ? b.pop() : '';
};

const checkCookie = cookieName => {
    return document.cookie.split(';').filter(item => item.trim().startsWith(`${symbol_dollar}{cookieName}=`)).length > 0;
};

const useCookieValue = cookieName => {
    if (!cookieName || cookieName.length === 0) {
        return '';
    }
    let value = checkCookie(cookieName) ? cookieValue(cookieName) : '';
    const setCookieValue = (value, age) => {
        const cookieSettings = `path=/; domain=${window.location.hostname};Max-Age=${symbol_dollar}{age !== undefined ? age : 3600}`;
        document.cookie = `${symbol_dollar}{cookieName}=${value};${symbol_dollar}{cookieSettings}`;
    };

    return [value, setCookieValue];
};

/**
 * This hook listens to messages from the AEM Sites editor, when in editing mode
 * and triggers a re-render of components using the hook.
 */
const useEditorEvents = () => {
    const [wcmmode] = useCookieValue('wcmmode');
    const [state, setState] = useState(1)
    const onMessage = event => {
        // Drop events from unknown origins
        if (event.origin !== window.location.origin) {
            return;
        }

        // Drop events that are not AEM Sites editor commands
        if (!event.data || !event.data.msg || event.data.msg !== 'cqauthor-cmd') {
            return;
        }

        // Skip commands that do not require a re-render
        if (event.data.data && event.data.data.cmd && event.data.data.cmd === 'toggleClass') {
            return;
        }

        // Update state to force re-render
        setState(state => state + 1)
    };

    useEffect(() => {
        // Only during editing
        if (wcmmode !== 'edit') {
            return;
        }

        window.addEventListener('message', onMessage, false);
        return () => {
            window.removeEventListener('message', onMessage, false);
        };
    }, []);

    return [state, setState]
};

export default useEditorEvents;
