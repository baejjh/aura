/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

({
    /**
     * Return labelId for label
     */
    getLabelIdValue: function(labelElement){
        return $A.test.getElementAttributeValue(labelElement,"for");
    },

    /**
     * Return Id for input
     */
    getInputIdValue: function(inputElement){
        return $A.test.getElementAttributeValue(inputElement,"id");
    },

    getLabelElement : function(label){
        var labelElement = label.getElementsByTagName('label');
 	   
 	    $A.test.assertTrue(!$A.util.isEmpty(labelElement), "There is no label element on the component in question");
 	    return labelElement;
    },
    /**
     * Test label separate from input with raw string id
     */
    testLabelSeparateFromInputWithRawStringId: {
        test: function(component){
            var label = component.find("rawStringLabel").getElement();
            var input = component.find("rawStringinput").getElement();
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Raw Id for label and input should be the same");
        }
    },

    /**
     * label separate from input with aura:id
     */
    testLabelSeparateFromInputWithAuraId: {
        test: function(component){
            var label = component.find("myinputtextLabel").getElement();
            var input = component.find("myinputtext").getElement();
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input should be the same");
        }
    },

    /**
     * hidden label separate from input
     */
    testHiddenLabel: {
        test: function(component){
            var label = component.find("myHiddenLabel").getElement();
            var input = component.find("myHiddeninputtext").getElement();
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for Hidden label and input should be the same");
            //check if the child has assistiveText as className
            $A.test.assertEquals("assistiveText", label.children[0].className, "Class Name should be assistiveText");
        }
    },

    /**
     * Label's created by iteration
     */
    testLabelCreationByIteration: {
        test: function(component){
            var input1 = component.find("iteration")[0].getElement();
            var label1Element = input1.getElementsByTagName('label')[0];
            var input1Element = input1.getElementsByTagName('input')[0];
            var label1Id = this.getLabelIdValue(label1Element);
            var input1Id = this.getInputIdValue(input1Element);
            $A.test.assertEquals(input1Id, label1Id, "Global Id for label0 and input created by iteration should be the same");
            
            var input2 = component.find("iteration")[1].getElement();
            var label2Element = input2.getElementsByTagName('label')[0];
            var input2Element = input2.getElementsByTagName('input')[0];
            var label2Id = this.getLabelIdValue(label2Element);
            var input2Id = this.getInputIdValue(input2Element);
            $A.test.assertEquals(input2Id, label2Id, "Global Id for label1 and input created by iteration should be the same");
        }
    },

    /**
     * Test label with default position
     */
    testLabelWithDefaultPosition: {
        attributes : {whichPosition : "left"},
        test: function(component){
            var div = component.find("myInputCheckbox").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('input')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input in default positon should be the same");
            $A.test.assertTrue($A.test.contains(label.className, "left"), "Class Name:" + label.className + " should contain left");
        }
    },

    /**
     * Test label with left position
     */
    testLabelWithLeftPosition: {
        test: function(component){
            var div = component.find("leftPosition").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('input')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input in Left positon should be the same");
            $A.test.assertTrue($A.test.contains(label.className, "left"), "Class Name:" + label.className + " should contain left");
        }
    },

    /**
     * Test label with Top position
     */
    testLabelWithTopPosition: {
        attributes : {whichPosition : "top"},
        test: function(component){
            var div = component.find("myInputCheckbox").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('input')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input in top positon should be the same");
            $A.test.assertTrue($A.test.contains(label.className, "top"), "Class Name:" + label.className + " should contain top");
            //check if label has display = block css property
            $A.test.assertEquals("block", $A.test.getStyle(label,'display'), "Css property for label with positon top should be display=block");
        }
    },

    /**
     * Test label with right position
     */
    testLabelWithRightPosition: {
        attributes : {whichPosition : "right"},
        test: function(component){
            var div = component.find("myInputCheckbox").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('input')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input in right positon should be the same");
            $A.test.assertTrue($A.test.contains(label.className, "right"), "Class Name:" + label.className + " should contain right");
        }
    },

    /**
     * Test label with bottom position
     */
    testLabelWithBottomPosition: {
        attributes : {whichPosition : "bottom"},
        test: function(component){
            var div = component.find("myInputCheckbox").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('input')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and input in bottom positon should be the same");
            $A.test.assertTrue($A.test.contains(label.className, "bottom"), "Class Name:" + label.className + " should contain bottom");
            //check if label has display = block css property
            $A.test.assertEquals("block", $A.test.getStyle(label,'display'), "Css property for label with positon bottom should be display=block");
        }
    },

    /**
     * Test label with hidden position
     * Test case for W-1728057
     */
    testLabelWithHiddenPosition: {
        test: function(component){
            var div = component.find("hiddenPosition").getElement();
            var label = div.getElementsByTagName('label')[0];
            var input = div.getElementsByTagName('textarea')[0];
            var labelId = this.getLabelIdValue(label);
            var inputId = this.getInputIdValue(input);
            $A.test.assertEquals(labelId, inputId, "Global Id for label and textarea in hidden positon should be the same");
            $A.test.assertEquals("assistiveText", label.children[0].className, "Class Name for Label should be assistiveText");
        }
    },
    
    /**
     * Test case W-2462881
     * Add title attribute into ui:input
     */
    testLabelWithLabelTitleSet: {
        attributes : {labelTitle : "labelTitle"},
        test: function(component){
            var div = component.find("inputCheckboxWithLabelTitle").getElement();
            var label = div.getElementsByTagName('span')[0];
            var expectedTitleLabel = "labelTitle"
            $A.test.assertEquals(expectedTitleLabel, label.title, "Title attribute for label is incorrect");
        }
    },
    
    testLabelWithoutLabelTitle: {
        test: function(component){
            var div = component.find("inputCheckboxWithLabelTitle").getElement();
            var label = div.getElementsByTagName('span')[0];
            $A.test.assertFalsy(label.title,'Title attribute for label should not be present');
        }
    },
    
    /**
     * Check to make sure that a label position that we are not expecting (something other than 'left', 'right', 'top', 'bottom')
     * defaults to left
     */
    testLabelWithWrongPosition : {
    	attributes : {whichPosition : "WRONG_LABEL"},
    	test : function(component){
    	   var labelElement = this.getLabelElement(component.find("myInputCheckbox").getElement());
    	   var labelClass = labelElement[0].getAttribute("class");
    	   $A.test.assertTrue(labelClass.indexOf("-left")>0, "The incorrect label attribute was found");
    	}  	
    },
    
    //Making sure that dynamically changing the label works as expected. Test is needed since input handles this case, not label
    testDynamicallyModifyingLabel : {
    	test : [function(component){
    		 var inputCmp = component.find("myInputCheckbox");
     	     var labelElement = this.getLabelElement(inputCmp.getElement());
      	     inputCmp.set("v.label", "myNewLabel");
    	},
    	function(component){
     	    var labelElement = this.getLabelElement(component.find("myInputCheckbox").getElement());
     	    var currLabelText = $A.util.getText(labelElement[0]);
     	    $A.test.assertEquals("myNewLabel", currLabelText, "New label was not populated through");    	    
    	}]
    },
    
    //Making sure that the dynamically modifying the labels display through input works as expected
    testDynamicallyModifyingLabelDisplay : {
    	test : [function(component){
    		 var inputCmp = component.find("myInputCheckbox");
    		 var labelElement = this.getLabelElement(component.find("myInputCheckbox").getElement());
      	     var currLabelText = $A.util.getText(labelElement[0]);
     	     $A.test.assertEquals("inputCheckbox", currLabelText, "Label should be present");
      	     inputCmp.set("v.labelPosition", "hidden");
    	},
    	function(component){
     	    var labelElement = this.getLabelElement(component.find("myInputCheckbox").getElement());
     	    var currLabelTextClass = labelElement[0].getElementsByTagName('span')[0].getAttribute("class");
     	    $A.test.assertEquals("assistiveText", currLabelTextClass, "New label was not populated through");    	    
    	}]
    },

    /**
     * Return labelId for label
     */
    testDestroyingLabelDoesNotLeakMemory: {
        test : [function(component) {
            var labelCmp = component.find("destroyLabel");
            $A.test.assertDefined(labelCmp, "label is undefined");
            labelCmp.destroy();
            $A.test.assertUndefined(component.find("labelText"),
                "label text node should have been destroyed");
        },
        function(component) {
            var labelCmp = component.find("destroyLabelHidden");
            $A.test.assertDefined(labelCmp, "label is undefined");
            labelCmp.destroy();
            $A.test.assertUndefined(component.find("labelTextHidden"),
                "label text node should have been destroyed");
        },
        function(component) {
            var labelCmp = component.find("destroyLabelNested");
            $A.test.assertDefined(labelCmp, "label is undefined");
            labelCmp.destroy();
            $A.test.assertUndefined(component.find("labelTextInnermost"),
                "label text node should have been destroyed");
            $A.test.assertUndefined(component.find("destroyLabelInner"),
                "inner label cmp should have been destroyed");
            $A.test.assertUndefined(component.find("destroyLabelInnermost"),
                "innermost label cmp should have been destroyed");
        }]
    }
})