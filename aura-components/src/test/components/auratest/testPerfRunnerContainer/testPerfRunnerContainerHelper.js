({
    STATE: {
        ENQUEUE: 'enqueued',
        RUNNING: 'running',
        FAILED : 'failed'
    },
    POLL_TIME : 3000,
    TOTAL_TEST_COUNT_HASH : {},
    _parseTestName: function (name) {
        //return name.match(/\:?(\w+)\(/)[1];
        return name.match(/([^_$]+\:?\w+)\(/)[1];
    },
    _parseTestNameSpace: function (ns) {
        return ns;
    },
    _parseStatus: function (status) {
        return status;
    },
    createRow: function (t) {
        //increase the counter
        this.TOTAL_TEST_COUNT_HASH[t.type] = this.TOTAL_TEST_COUNT_HASH[t.type] + 1 || 1;

    	//changes from array join to string concat for performance reason
        return '<li class="list-test-item" data-testid="' + t.name + '" test-type="' + t.type + '"' + (t.jsConsole ? ' data-jsc="true"' : ' ') +'">' +
                '<div class="parts">' +
                    '<div class="checkbox">'+
                    '<input type="checkbox" class="chk-test" data-testid="' + t.name + '" /></div>' +
                	'<div class="test-type"></div>' +
                    '<div class="test">' +
                        '<p class="name">' + this._parseTestName(t.name) + '</p>' +
                        '<p class="ns">'+ this._parseTestNameSpace(t.name) + '</p>' +
                    '</div>' +
                    '<div class="status">' +
                        '<span class="icon status-icon" data-state-text="'+ this._parseStatus(t.status) + '"></span>' +
                        '<span class="icon results"></span>' +
                    '</div>' +
                    '<div class="jsConsole">' +
                        '<a href="' + t.jsConsole + '" target="_blank"><span class="icon icon-meter"></span></a>' + 
                    '</div>' +
                    '<div class="testResult">' +
                    '</div>' +
                '</div>' +
                '<div class="exception"></div>' +
            '</li>';
    },
    buildDOM: function (testArray) {
        var placeholder = document.createElement('div'),
            tmp = '<div class="test-container"><ul class="list">', i;

        for (i = 0; i < testArray.length; i++) {
            tmp += this.createRow(testArray[i]);
        }

        tmp += '</ul></div>';
        placeholder.innerHTML = tmp;
        return placeholder.firstChild;
    },
    renderTests: function(testArray, parent){
        var testsPerBlock = 100;
        var container = document.createElement("div");
            container.className = "test-container";
        
            
        var selectedList = document.createElement("ul");
        selectedList.className = "list selected-list";
        container.appendChild(selectedList);
            
        var curTestsPerBlock = testsPerBlock;
        var list;
        
        var length = testArray.length;
        for(var c=0;c<length;c++){
            if (list === undefined){
                //first ul
                list = document.createElement("ul");
                list.className = "list";
                container.appendChild(list);
            }
            else if(curTestsPerBlock === 0){
                //subsequent ul
                curTestsPerBlock = testsPerBlock;
                list = document.createElement("ul");
                list.className = "list";
                container.appendChild(list);
            }
        	
        	//insert to the dom
        	list.insertAdjacentHTML(
    			'beforeend',
    			this.createRow(testArray[c])
			);
        	
        	//decrease count
        	curTestsPerBlock--;
        }

        //append to parent dom
        parent.appendChild(container);

        //update total test count
        this.TOTAL_TEST_COUNT = testArray.length;
    },

    attachEvents: function (cmp, dom) {
        var self        = this,
        	inputOperator = dom.querySelector(".search-ops"),
        	inputCaseSensitive = dom.querySelector('.search-case-sensitive input'),
            inputSearch = dom.querySelector('.search'),
            selectAll   = dom.querySelector('#toggle_select_all'),
            runButton   = dom.querySelector('.run'),
            failButton  = dom.querySelector('.toggle_failed'),
            testContainer = dom.querySelector(".test-container"),
            selectedList = testContainer.querySelector('.selected-list'),
            toggleTestType = dom.querySelector('.toggle_test_type'),
            moveSelTop = dom.querySelector('.move_sel_top');
        
        var timeoutDebounce, totalDebounceTime = 1500;

        failButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.toggleFailTests(cmp, failButton, dom, e);
        });

        
        var handlerSearchInputChange = function () {
        	if(timeoutDebounce){
    			clearTimeout(timeoutDebounce);
    		}

            //show loading
            self.setPageState('Loading...');
    		
    		//doing a little stuff here
        	testContainer.style.opacity = '0.2';
        	
    		//little debounce
			timeoutDebounce = setTimeout(function(){
			    var test_unit = toggleTestType != null && toggleTestType.querySelector('input.test_unit');
			    var test_integ = toggleTestType != null && toggleTestType.querySelector('input.test_integ');
			    var test_jstest = toggleTestType != null && toggleTestType.querySelector('input.test_jstest');
			    var test_webdriver = toggleTestType != null && toggleTestType.querySelector('input.test_webdriver');

                //remove the loading
                self.setPageState('');

        		self.filterTests(
    				dom,
    				inputSearch.value,
    				inputOperator.value,
    				inputCaseSensitive.checked,
    				test_unit && test_unit.checked,
    				test_integ && test_integ.checked,
    				test_jstest && test_jstest.checked,
    				test_webdriver && test_webdriver.checked
				);
        		testContainer.style.opacity = '';
        	}, totalDebounceTime);
        };
        inputSearch.addEventListener('input', handlerSearchInputChange);
        inputOperator.addEventListener('input', handlerSearchInputChange);
        inputCaseSensitive.addEventListener('change', handlerSearchInputChange);
        if (toggleTestType != null) {
            var testTypeInputs = toggleTestType.querySelectorAll('input');
            for (var i = 0; i < testTypeInputs.length; i++){
                testTypeInputs[i].addEventListener('change', handlerSearchInputChange);
            }
        }    
        
        //select all visible tests
        selectAll.addEventListener('change', function(){
            self.toggleSelection(selectAll, dom);
        });


        //run selected tests
        runButton.addEventListener('click', function (e) {
            self.runTests(cmp, dom, e);
        });
        
        //delegate for checkbox state
        testContainer.addEventListener('click', function(e){        	
        	if (e.target.nodeName === "INPUT" && e.target.classList.contains('chk-test')){
        		//get the closest li
    			var targettedRow = e.target;
            	while(targettedRow && targettedRow.nodeName !== "LI"){
            		targettedRow = targettedRow.parentNode;
            	}

                //toggle hl-row state based on checked state
        		targettedRow.classList.toggle("hl-row", e.target.checked);
        		
        		//update the selected test count
        		var countSelected = testContainer.querySelectorAll('.chk-test:checked').length;
        		self._updateSelectedTestCount(countSelected);
        	}
        });
    

        //move selected to top
        moveSelTop.addEventListener('click', function(e){
            var selectedRows = dom.querySelectorAll('.hl-row');

            for (var i = 0; i < selectedRows.length; i++){
                var curRow = selectedRows[i];
                
                //only move to top , if the parent is not in selected list
                if (false === curRow.parentNode.classList.contains('selected-list')){
                    selectedList.insertAdjacentElement("AfterBegin", curRow);
                }
            }

            //scroll conatiner to top
            self.scrollTestContainerToTop();
        });
        
        
        //filter on page load if needed
        //handle initial attribute if any query string
        var keyword = cmp.get('v.keyword');
        if (keyword !== undefined && keyword.length > 0){
        	handlerSearchInputChange();
        }


        //remove the loading state
        self.setPageState('');
        self._updateSelectedTestCount(0);


        //update stat
        var testStatDomArray = [];
        this.TOTAL_TEST_COUNT_HASH['Total'] = this.TOTAL_TEST_COUNT;
        for (var testType in this.TOTAL_TEST_COUNT_HASH){
            var testCount = this.TOTAL_TEST_COUNT_HASH[testType];
            testStatDomArray.push('<b>' + testType + ':</b><span>' + testCount + '</span>');
        }
        document.querySelector('#test-stat').innerHTML = testStatDomArray.join('');
    },

    scrollTestContainerToTop: function(){
        document.querySelector(".test-container").scrollTop = 0;
    },

    setPageState: function(newText){
        document.querySelector('#pageState').innerHTML = newText;
    },

    toggleIntegrationTests: function (button, dom, e) {
        var children   = dom.querySelectorAll('li[test-type="integration"]'),
            selected   = $A.util.getDataAttribute(button, 'selected') !== "true",
            visibility = selected ? 'hidden': 'visible',
            i;

            // we dont do it with CSS because we need to update the state of the li elements
            for (i = 0; i < children.length; i++) {
                $A.util.setDataAttribute(children[i], 'visible', visibility);
            }
            button.firstChild.checked = selected;
            $A.util.setDataAttribute(button, 'selected', selected);
    },
    toggleFailTests: function (cmp, button, dom, e) {
        var children   = dom.querySelectorAll('li:not([data-state="failed"])'),
            selected   = $A.util.getDataAttribute(button, 'selected') !== "true",
            visibility = selected ? 'hidden': 'visible',
            i;

            if (!cmp._finishRun) {
                button.querySelector('input').checked = false;
                return alert('You need to run tests first!');
            }


            // we dont do it with CSS because we need to update the state of the li elements
            for (i = 0; i < children.length; i++) {
                $A.util.setDataAttribute(children[i], 'visible', visibility);
            }
            $A.util.setDataAttribute(button, 'selected', selected);
            button.firstChild.checked = false;
    },
    toggleSelection: function (select_all_checkbox, dom) {
        var filtered   = dom.querySelectorAll('li:not([data-visible="hidden"]) input[type="checkbox"]'),
            isSelectedAll = select_all_checkbox.checked,
            input,
            i;


        //update selected count
        this._updateSelectedTestCount(isSelectedAll === true ? filtered.length : 0);

        //checkbox state for only visible items
        for (i = 0; i < filtered.length; i++) {
            input = filtered[i];
            input.checked = isSelectedAll;
        }
        
        //update selected count
    	this._updateSelectedTestCount(isSelectedAll ? filtered.length : 0);

        //highlight state
        var testRowEntries = document.querySelectorAll('li.list-test-item');
        for (var i = 0; i < testRowEntries.length; i++){
            testRowEntries[i].classList.toggle('hl-row', isSelectedAll);
        }
    },
    _updateSelectedTestCount: function(count){
        //update the 
        document.querySelector('#count_test_selected').innerHTML = count > 1 ? '<b>' + count + '</b>' + ' Tests Selected' : count === 1 ? '<b>' + count + '</b>' + ' Test Selected' : '';
    },
    calcOrOperators: function(regexp, name){
    	for (var j = 0; j < regexp.length; j++){
        	if (regexp[j].test(name) === true) {
        		//at least one match
        		return true;
        	}
        }
    	
    	return false;
    },
    calcAndOperators: function(regexp, name){
    	for (var j = 0; j < regexp.length; j++){
        	if (regexp[j].test(name) === false) {
        		//at least one not matched, return
        		return false;
        	}
        }
    	
    	return true;//all matched
    },
    filterTests: function (dom, query, logicOps, isCaseSensitive, test_unit, test_integ, test_jstest, test_webdriver) {   	
        var children  = dom.querySelectorAll(".list-test-item"),
        	calcOperator = logicOps === 'AND' ? this.calcAndOperators : this.calcOrOperators,
			hasAtLeastOneVisible = false,
            matches   = [],
            regexp = [], li, name, i, queries;
        
        //setup the query
        query = query || '';
        query = query.trim();

    	if (query.length === 0 && test_unit && test_integ && test_jstest && test_webdriver) {
    		//when it is empty, just show it
        	for (i = 0; i < children.length; i++) {
                $A.util.setDataAttribute(children[i], 'visible', 'visible');
            }
    	}
    	else {
        	//allow use of , to match multiple item
            //find the regex array
    		if (query.length > 0){
    			queries = query.split(',');
            	
            	for (var i = 0 ; i < queries.length; i++){
            		var query_str = queries[i].trim();
            		if (query_str.length > 0){
            			regexp.push(
        					new RegExp(query_str, isCaseSensitive ? '' : 'i')
    					);
            		}
            	}
    		}
        	
            for (i = 0; i < children.length; i++) {
            	var isVisible = false;
            	
                li = children[i];
                if (li.getElementsByTagName("input")[0].checked) {
                	//if checked, always visible
                    isVisible = true;
                }
                else{
                	name = li.getElementsByClassName('ns')[0].textContent;
                	
                	if (test_unit === true && $A.util.getElementAttributeValue(li, 'test-type') === 'unit'){
                        isVisible = true;
                    }
                	else if (test_integ === true && $A.util.getElementAttributeValue(li, 'test-type') === 'integration'){
                		isVisible = true;
                	}
                    else if (test_jstest === true && $A.util.getElementAttributeValue(li, 'test-type') === 'jstest'){
                        isVisible = true;
                    }                	
                    else if (test_webdriver === true && $A.util.getElementAttributeValue(li, 'test-type') === 'webdriver'){
                        isVisible = true;
                    }
                	
                    //calling the regex match
                	if (isVisible === true && queries !== undefined){
                		//only need regex again if isvisible true
                		isVisible = calcOperator(regexp, name);
                	}
                }
                
                hasAtLeastOneVisible = hasAtLeastOneVisible || isVisible;
                                
                $A.util.setDataAttribute(children[i], 'visible', isVisible === true ? 'visible' : 'hidden');
            }
            
            if(hasAtLeastOneVisible === false){
            	alert('There is no test matching your filter');
            }
        }
    },
    _getLiFromInput: function (input) {
        return input.parentElement.parentElement.parentElement;
    },
    runTests: function (cmp, dom, e) {
        var self       = this,
            testCb     = dom.querySelectorAll('input[type="checkbox"]:checked'),
            testRunner = cmp.get("c.runTestSet"),
            pollTime   = this.POLL_TIME,
            tests      = [],
            row,li, i, id;
        
        if (cmp._runningTests) {
               var r = confirm("Tests are still pending execution. Are you sure you want to submit a new request?");
               if (r == true) {
                      this.updateStatus("Submiting a new request");
               } else {
                      this.updateStatus("Continue working on pending execution.");
                      return;
               }
        }
        console.log(testCb);
        for (i = 0; i < testCb.length; i++) {
            row      = testCb[i];
            id       = $A.util.getDataAttribute(row, 'testid');
            if(id){
                   tests.push(id);
                li = this._getLiFromInput(row);
                   $A.util.setDataAttribute(li, 'state', this.STATE.ENQUEUE);
            }
        }

        if (tests.length) {
            testRunner.setParams({testSet: tests});
            testRunner.setCallback(this, function(action) {
                   if (action.getState() === "SUCCESS") {
                       setTimeout(function () {
                              //we don't have first pollAction yet, pass undefined 
                           self.pollTestResults(cmp, dom, undefined, action);
                       }, pollTime);
                   } else if (action.getState() == "INCOMPLETE" || action.getState() == "ERROR") {
                          alert("testRunner Action un-successful (return state = "+action.getState()+"), please check the server");
                          finishTestRun(cmp, null, null, false);
                   } else {
                          console.log("we have abort the testRunner action#"+action.getId(),action);
                   }
            });
            this.updateStatus('Enqueueing '+ tests.length +' tests...');
            $A.run(function () {
                cmp._runningTests = true;
                $A.enqueueAction(testRunner);
            });
        } else {
            this.updateStatus('No tests to run...');
            alert('You must select at least one test');
        }
        
    },
    updateStatus: function (status) {
        //TODO: Send an event instead
        i = document.body.querySelector('.status-bar');
        i.textContent = status;
    },
    updateTests: function (result, dom) {
        var testsMap     = result.testsWithPropsMap,
            enqueueState = this.STATE.ENQUEUE,
            runningState = this.STATE.RUNNING,
            selectorEnq  = 'li[data-state="' + enqueueState + '"]',
            selectorRun  = 'li[data-state="' + runningState + '"]',
            enqueueTest  = Array.prototype.slice.call(dom.querySelectorAll(selectorEnq)),
            runningTest  = Array.prototype.slice.call(dom.querySelectorAll(selectorRun)),
            queuedTest   = enqueueTest.concat(runningTest),
            test, update, id, i, updateState;

        for (i = 0; i < queuedTest.length; i++) {
            test   = queuedTest[i];
            id     = $A.util.getDataAttribute(test, 'testid');
            update = testsMap[id];
            updateState = update.status.toLowerCase();
            $A.util.setDataAttribute(test, 'state', updateState);
            console.log(update);
            if (updateState === this.STATE.FAILED) {
                test.querySelector('.exception').innerHTML = update.exception
                                                                .replace(/&/g, '&amp;')
                                                                .replace(/</g, '&lt;')
                                                                .replace(/>/g, '&gt;')
                                                                .replace(/\n/g, '<br>')
                                                                .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            }
        }
        this.updateStatus('Tests Running | Last update: ' + (new Date()).toLocaleString());
    },
    finishTestRun: function (cmp, actionResult, dom, success) {
        if(success) {
               this.updateTests(actionResult, dom);
               this.updateStatus('Ready to run more tests!');
        }
        cmp._runningTests = false;
        cmp._finishRun = true;
    },
    pollTestResults: function (cmp, containerDOM, previousPollActionForThisTestRunnerAction, testRunnerActionCurrent) {
        var self       = this,
            pollAction = cmp.get("c.pollForTestRunStatus"),
            pollTime   = this.POLL_TIME,
            dom        = containerDOM || cmp.getElement();
        
        pollAction.setAbortable(true);
        pollAction.setCallback(this, function (action) {
            if (action.getState() === "SUCCESS") {
                var actionResult = action.getReturnValue();
                self.updateTests(actionResult, dom);
                if (actionResult.testsRunning) {
                    setTimeout(function() {
                        self.pollTestResults(cmp, dom, action, testRunnerActionCurrent);
                                   }, pollTime);
                            } else {
                                          self.finishTestRun(cmp, actionResult, dom, true);
                            }
            } else if (action.getState() == "INCOMPLETE" || action.getState() == "ERROR"){
                   alert("poll Action un-successful (return state = "+action.getState()+"), please check the server");
                   self.finishTestRun(cmp, null, null, false);//we still better to clear cmp._XXX up
            } else {
                   console.log("we have abort the pollAction:"+action.getId()); 
            }
        });
        
        //we only set abortableID to pollActions after the first one for each testRunner Action.
        //so when new testRunner Action success, the pollActions belong to revious testRunner Action will get aborted.
        if( previousPollActionForThisTestRunnerAction != undefined ) {
            pollAction.setParentAction(previousPollActionForThisTestRunnerAction); 
           }

        $A.run(function () {
               $A.enqueueAction(pollAction);
        });
    }
})