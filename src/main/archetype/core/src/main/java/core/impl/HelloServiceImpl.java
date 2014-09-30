/*
 *  Copyright 2014 Adobe Systems Incorporated
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
#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.core.impl;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.settings.SlingSettingsService;

import ${package}.core.HelloService;

/**
 * One implementation of the {@link HelloService}. Note that
 * the settings service is injected, not retrieved.
 */
@Service(value = HelloService.class)
@Component(immediate = true)
public class HelloServiceImpl implements HelloService {

    @Reference
    private SlingSettingsService settings;
    
    @Override
    public String getMessage() {
        return "Hello World, this is instance " + settings.getSlingId();
    }

}
