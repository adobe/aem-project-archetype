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
package apps.${appsFolderName}.components.content.topnav;

import com.adobe.cq.sightly.WCMUse;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.day.cq.commons.Filter;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageFilter;

public class Topnav extends WCMUse {
	
	private Iterator<Map<String, Object>> pageInfos;
    
    @Override
    public void activate() {
        Page homePage = getCurrentPage().getAbsoluteParent(1);
        Iterator<Page> it = homePage.listChildren((Filter<Page>) new PageFilter());
        List<Map<String, Object>> infos = new LinkedList<Map<String,Object>>();
        while(it.hasNext()) {
            Page p = it.next();
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("path", p.getPath());
            map.put("title", p.getTitle());
            if (p.getPath().equals(
                    getCurrentPage().getAbsoluteParent(2).getPath())) {
                map.put("selected", true);
            } else {
                map.put("selected", false);
            }
            infos.add(map);
        }
        pageInfos = infos.iterator();
    }
    
    public Iterator<Map<String, Object>> listPageInfos() {
    	return pageInfos;
    }
    
}