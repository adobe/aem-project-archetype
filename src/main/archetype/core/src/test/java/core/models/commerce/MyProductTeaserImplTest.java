/*******************************************************************************
 *
 *    Copyright 2020 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/
package ${package}.core.models.commerce;

import com.adobe.cq.commerce.core.components.models.common.Price;
import com.adobe.cq.commerce.core.components.models.productteaser.ProductTeaser;
import com.adobe.cq.commerce.core.components.models.retriever.AbstractProductRetriever;
import com.adobe.cq.commerce.magento.graphql.ProductInterface;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.scripting.WCMBindingsConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import junit.framework.Assert;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.internal.util.reflection.FieldSetter;
import org.mockito.internal.util.reflection.FieldReader;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@ExtendWith(AemContextExtension.class)
class MyProductTeaserImplTest {

    private final static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final String PAGE = "/content/page";
    private static final String PRODUCTTEASER_NO_BADGE = "productteaser-no-badge";
    private static final String PRODUCTTEASER_BADGE_FALSE = "productteaser-badge-false";
    private static final String PRODUCTTEASER_BADGE_TRUE_NO_AGE = "productteaser-badge-true-no-age";
    private static final String PRODUCTTEASER_BADGE_TRUE_WITH_AGE = "productteaser-badge-true-with-age";

    public final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    private MyProductTeaser underTest;

    private ProductTeaser productTeaser;

    @Mock
    private AbstractProductRetriever productRetriever;

    @Mock
    private ProductInterface product;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.initMocks(this);
        Mockito.when(productRetriever.fetchProduct()).thenReturn(product);
        Mockito.when(product.getCreatedAt()).thenReturn("2020-01-01 00:00:00");

        Page page = context.create().page(PAGE);
        createResource(page, PRODUCTTEASER_NO_BADGE, null, null);
        createResource(page, PRODUCTTEASER_BADGE_FALSE, false, null);
        createResource(page, PRODUCTTEASER_BADGE_TRUE_NO_AGE, true, null);
        createResource(page, PRODUCTTEASER_BADGE_TRUE_WITH_AGE, true, 3);

        context.addModelsForClasses(MyProductTeaserImpl.class);
    }

    void createResource(Page page, String name, Object badge, Object age) {
        Map<String, Object> props = new HashMap<>();
        props.put("sling:resourceType", "venia/components/commerce/productteaser");
        props.put("sling:resourceSuperType", "core/cif/components/commerce/productteaser/v1/productteaser");
        if (badge != null) {
            props.put("badge", badge);
            if (age != null) {
                props.put("age", age);
            }
        }
        context.create().resource(page, name, props);
    }

    void setup(String resourceName) throws Exception {
        Page page = context.currentPage(PAGE);
        context.currentResource(PAGE + "/jcr:content/" +resourceName);
        Resource teaserResource = context.resourceResolver().getResource(PAGE + "/jcr:content/" +resourceName);

        // This sets the page attribute injected in the models with @Inject or @ScriptVariable
        SlingBindings slingBindings = (SlingBindings) context.request().getAttribute(SlingBindings.class.getName());
        slingBindings.setResource(teaserResource);
        slingBindings.put(WCMBindingsConstants.NAME_CURRENT_PAGE, page);
        slingBindings.put(WCMBindingsConstants.NAME_PROPERTIES, teaserResource.getValueMap());
        try {
            slingBindings.put("urlProvider", Mockito.mock(Class.forName( "com.adobe.cq.commerce.core.components.services.UrlProvider" )));
        } catch( ClassNotFoundException e ) {
            //probably core-cif-components-core version < 0.10.2
        }

        underTest = context.request().adaptTo(MyProductTeaser.class);
        if (underTest != null) {
            Class<? extends MyProductTeaser> clazz = underTest.getClass();
            productTeaser = Mockito.spy((ProductTeaser)(new FieldReader(underTest, clazz.getDeclaredField("productTeaser")).read()));
            FieldSetter.setField(underTest, clazz.getDeclaredField("productTeaser"), productTeaser);
            FieldSetter.setField(underTest, clazz.getDeclaredField("productRetriever"), productRetriever);
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {PRODUCTTEASER_NO_BADGE, PRODUCTTEASER_BADGE_FALSE, PRODUCTTEASER_BADGE_TRUE_NO_AGE})
    void testShowBadge_false(String resourcePath) throws Exception {
        setup(resourcePath);
        Assert.assertNotNull(underTest);
        Assert.assertFalse(underTest.isShowBadge());
    }

    @Test
    void testShowBadge_true() throws Exception {
        setup(PRODUCTTEASER_BADGE_TRUE_WITH_AGE);
        Mockito.when(product.getCreatedAt()).thenReturn(LocalDateTime.now().minusDays(1).format(formatter));

        Assert.assertNotNull(underTest);
        Assert.assertTrue(underTest.isShowBadge());
    }

    @Test
    void testGetName() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn("TestName").when(productTeaser).getName();
        Assert.assertEquals("TestName", underTest.getName());
    }

    @Test
    void testGetPriceRange() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Price priceRange = Mockito.mock(Price.class);
        Mockito.doReturn(priceRange).when(productTeaser).getPriceRange();
        Assert.assertEquals(priceRange, underTest.getPriceRange());
    }

    @Test
    void testGetImage() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn("TestImage").when(productTeaser).getImage();
        Assert.assertEquals("TestImage", underTest.getImage());
    }

    @Test
    void testGetUrl() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn("TestUrl").when(productTeaser).getUrl();
        Assert.assertEquals("TestUrl", underTest.getUrl());
    }

    @Test
    void testGetSku() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn("TestSKU").when(productTeaser).getSku();
        Assert.assertEquals("TestSKU", underTest.getSku());
    }

    @Test
    public void testGetCallToAction() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn("TestCTA").when(productTeaser).getCallToAction();
        Assert.assertEquals("TestCTA", underTest.getCallToAction());
    }

    @Test
    void testIsVirtualProduct() throws Exception {
        setup(PRODUCTTEASER_NO_BADGE);
        Mockito.doReturn(true).when(productTeaser).isVirtualProduct();
        Assert.assertTrue(underTest.isVirtualProduct());

        Mockito.doReturn(false).when(productTeaser).isVirtualProduct();
        Assert.assertFalse(underTest.isVirtualProduct());
    }
}
