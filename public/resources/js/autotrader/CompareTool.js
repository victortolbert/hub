/**
 * CompareTool.js
 * @name CompareTool
 * @fileoverview Provides AJAX data and page interaction for the compare-models.jsp
 * @requires ATC.js, prototype.js version 1.6.0 or greater
*/

//---------------------------------------------------------------------------------------------------------------------
/**
 * Compare Tool data population via AJAX and
 * @class CT
 * @author Dennis Sarvis
 * @example
 * Usage examples:
 * === Initialize
 * var ct = new CT();
 * === Examples of how to lookup the styleId returning a style object that will call the populate a column function:
 * var a = ct.getModelInfo(styleId, column);
 *
 *
 */
//var CT = Class.create();
//bind to table id="data-table"
var CT;
    function initCompare() {
        CT = new ATC.cs.research.ct.CompareTool();
    }
//---------------------------------------------------------------------------------------------------------------------
// Create namespace for the class
ATC.createNamespace('ATC.cs.research.ct');
//---------------------------------------------------------------------------------------------------------------------
// Class CompareTool
ATC.cs.research.ct.CompareTool = function() {
    this.initialize();
    this.initEventHandlers();
};
//---------------------------------------------------------------------------------------------------------------------
    /**
     * Constructor.
     * @throws exception if Prototype 1.6.0 or greater is not loaded.
     */
ATC.cs.research.ct.CompareTool.prototype.initialize = function () {
        // Make sure Prototype is included.
        var exception = "BI requires Prototype version 1.6.0 or greater.";
        if(typeof Prototype == "undefined")
        {
            throw(exception);
        }
        // Make sure it is version 1.6.0 or greater.
        var ver = Prototype.Version.split(".");
        var major = ver[0];
        var minor = ver[1];
        if(major < 1)
        {
            throw(exception);
        }
        if(minor < 6)
        {
            throw(exception);
        }
    //class variables
    this.global_util = new global_util();
    this.styles = new Array();
    this.previous = new Array();
    this.similar = new Array();
    this.others = new Array();
};
//---------------------------------------------------------------------------------------------------------------------
    /**
     * initializes event handlers.
     */
ATC.cs.research.ct.CompareTool.prototype.initEventHandlers = function() {

    //event binding for MMY dropdowns to add/edit a vehicle
    //TODO prepopulate these when veicle is changed so it will be populated when user chooses to change again
    var makes = $$('select.make');
    makes.each ( function (make){
        Event.observe(make,'change',ATC.cs.research.ct.CompareTool.prototype.makeChanged, false);
    });
    var models = $$('select.model');
    models.each ( function (model){
        Event.observe(model,'change',ATC.cs.research.ct.CompareTool.prototype.modelChanged, false);
    });
    var years = $$('select.year');
    years.each ( function (year){
        Event.observe(year,'change',ATC.cs.research.ct.CompareTool.prototype.yearChanged, false);
    });
    //TODO default to base trim
    var adds = $$('input.add-style');
    adds.each ( function (add){
        Event.observe(add,'click',ATC.cs.research.ct.CompareTool.prototype.getModelInfoWrapper, false);//addStyle($F('style'))
        //Event.observe(add,'click',ATC.cs.research.ct.CompareTool.prototype.addStyle, false);//addStyle($F('style'))
    });

    // Change Zip Code
    Event.observe($$('input.change-zip')[0], 'click', ATC.cs.research.ct.CompareTool.prototype.zipValidation , false );
   //Event Binding for the Compare Buffer Form Zip Validations
    //changeVehicleZip();
    //Event.observe('address', 'focus', clearDefaultText);
    //Event.observe('address', 'blur', resetDefaultText);
    //Event.observe('address', 'keyup', changeVehicleZip);
    //Event.observe('address', 'change', changeVehicleZip);

    // Clear Comparison
    Event.observe($$('input.clear-all')[0], 'click', ATC.cs.research.ct.CompareTool.prototype.clearAll , false );


    // Add another Model
    //add event handlers for add, edit/change style, suggested vehicle radio, suggested vehicle add link
        var addModelButtons = $$("tr#actions input[type=button].add");
        addModelButtons.each( function(addModelButton) {
            Event.observe(addModelButton, 'click', ATC.cs.research.ct.CompareTool.prototype.buttonAddClick, false );
        });

    // Change Selection List
        var radios = $$('.select-suggestion input[type="radio"].radio');
        radios.each( function (radio) {
            Event.observe(radio, 'click', ATC.cs.research.ct.CompareTool.prototype.radioSuggestClick, false);
        });

    // Toggle Details
    var togglers = $$('.toggler a');
    togglers.each( function (toggler){
        Event.observe(toggler, 'click', ATC.cs.research.ct.CompareTool.prototype.togglerClick, false);
    });

};
//---------------------------------------------------------------------------------------------------------------------


    /**
     * Initialize the page onload by calling the populate a column function looping for each style ID in the list
     * from the selection page index starts at 0 so add one (or use count).
     * @param styleIds a list of style IDs to prepopulate the page.
     */
ATC.cs.research.ct.CompareTool.prototype.initGetModelInfo = function (styleIds) {//alert("initGetModelInfo"+styleIds);
         if (styleIds != null) {
            styleIds.split(/,/).each( function (styleId, column ) {
                if (styleId != null && styleId !=0) { ATC.cs.research.ct.CompareTool.prototype.getModelInfo(styleId, column + 1); }
            });
         }
    };


ATC.cs.research.ct.CompareTool.prototype.getModelInfoWrapper = function (evt) {//alert("initGetModelInfo"+styleIds);
    var child = Event.element(evt);
    var theColumnNumber = this.up('td').className.slice(8);
    var styleId = this.up('span').previous('span').down('select.style-select').value;
        //alert(styleId);
    ATC.cs.research.ct.CompareTool.prototype.getModelInfo(styleId, theColumnNumber);
    //TODO hide the add selections container
    this.up('span.ultra-pop').hide();

    };
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.compareSelectionOnLoad = function ( MIvehicle_number1 ) {
    //Load style from MI detail page compare to any model link

        //creates compareList array, optional parameter tells it to use compare-selection.js addStyle(style) rather than MI
        // rebuildCompareListFromCookie(true, ( (MIvehicle_number1 == null || MIvehicle_number1 == "" )?"":MIvehicle_number1));

};
//---------------------------------------------------------------------------------------------------------------------

    /**
    * DWR Lookup the styleId returning a style object that will call the populate a column function.
    * @param styleId a numerical style ID
    * @param column the column to populate 1,2,3,4
    */
ATC.cs.research.ct.CompareTool.prototype.getModelInfo = function (styleId, column) {//alert("getModelInfo");
        if (styleId != null && styleId !=0) {
            var callback = function (style) {
                ATC.cs.research.ct.CompareTool.prototype.displayModelInfo(style, column);
            }
            //DWR call to ModelSearchUtil.java
            ModelSearchUtil.findStyle(styleId, callback);//TODO indeterminate progress indicator or ajax loading progress
        }
        //call function to update Comparing # - # of #
    };
//---------------------------------------------------------------------------------------------------------------------
    /**
    * Write data to populate a column.
    * @param style a style object
    * @param column the column to populate 1,2,3,4
    */
ATC.cs.research.ct.CompareTool.prototype.displayModelInfo = function (style, column) {
        //Change column to pending, clear all data, update data, then show again
        //$("compare_"+column).addClassName('pending').hide();
        //TODO show loading icon in this column or use loading prototype in the callback

        //TODO remove all data as it is added? or all at once
        //ATC.cs.research.ct.CompareTool.prototype.removeColumnData(column);

        //advertisement column style----------------------
        //decide if Ad and remove extra options or add them back if it was an Ad and now is not
        //$("compare_"+column).removeClassName('pending').show();

        //TODO: SE add style bool Ad flag if an advertisement
        //TODO: UIE if advertisement then change table data-table, tr advertising-text, td class=compare_1 plain to compare_1 inline-ad
        //Advertisement will only be column 4
        // append inline-ad to all elements with class $$("compare_"+column)

        //UPDATE ALL DATA---------------------------------
        //Top YMM link
    //alert($("year-make-model").down("th.compare-"+column+" span span a").inspect());
    //TODO show
        //TODO re-show the td's original style
        $("year-make-model").down('th.compare-'+column).removeClassName('hidden');

        $('price').down('td.compare-'+column).removeClassName('hidden');//.setStyle({'background' : 'none'});
        $('fuel-mileage').down('td.compare-'+column).removeClassName('hidden');//.setStyle({'background' : 'none'});
        $('customer-ratings-and-reviews').down('td.compare-'+column).removeClassName('hidden');//.setStyle({'background' : 'none'});
        $('next-steps').down('td.compare-'+column).removeClassName('hidden');//.setStyle({'background' : 'none'});


        $("year-make-model").down("th.compare-"+column+" span span a").innerHTML = style.year + " " + style.make + " " + style.model;
        //TODO: get modelId and other params needed for the URL
        //$("year-make-model").down("td.compare_"+column).down("a").href = "/research/car-models/" + style.year + "-" + style.make.replace(/[^a-zA-Z0-9\.~_-]/g,"-") + "-" + style.model.replace(/[^a-zA-Z0-9\.~_-]/g,"-") + "/" + style.modelId + "-" + style.isHybrid + ( style.bodyType != null ? "-" + style.bodyType : "" ) + "/" + style.trim.replace(/[^a-zA-Z0-9\.~_-]/g,"-") + "~model.jsp?ad_min_price=" + style.minPrice + "&ad_max_price=" + maxPrice + "&sortBy=priceASC&rdpage=FRMGEN";

        //image
        ATC.cs.research.ct.CompareTool.prototype.addPictureToMain(style, column);

        //trim level dropdown
        ATC.cs.research.ct.CompareTool.prototype.updateStyles(style.year, style.make, style.model, column);

        //price
            var p = ATC.cs.research.ct.CompareTool.prototype.cleanString(style.price);
            var priceConvert = ATC.cs.research.ct.CompareTool.prototype.global_util.formatCurrency(p.toFixed(0));
        //$$("td.compare_"+column+" span>span").innerHTML
        $("average-market-price").down("td.compare_"+column+" span").innerHTML = priceConvert;//Style.Pricing.DisplayPrice

        //mileage
        //TODO: find rule for auto v manual
        //$("td.compare_"+column+" span.hwy").innerHTML
        $("fuel-mileage").down("td.compare_"+column+" span").innerHTML = "Hwy: " + (style.fuel.epaAutoHighway != null ? style.fuel.epaAutoHighway : (style.fuel.epaManualHighway != null ? style.fuel.epaManualHighway : "-")) + " MPG<br/> City: " + (style.fuel.epaAutoCity != null ? style.fuel.epaAutoCity : (style.fuel.epaManualCity != null ? style.fuel.epaManualCity : "-")) + " MPG";

        //ratings
        ATC.cs.research.ct.CompareTool.prototype.addRatingToMain(style, column);

        //read reviews
    //var reviewUrl = "/research/car-models/"+style.year+"-"+style.make+"-"+style.model.toString().replaceAll("([^A-Za-z0-9 _-]+)", " ")+"/"+style.modelId+
    //                "<c:if test="${!empty param.styleId}">-<c:out value="${param.styleId}"/></c:if><c:if test="${!empty param.hybrid}">-<c:out value="${param.hybrid}"/></c:if><c:if test="${!empty param.body_style}">-<c:out value="${param.body_style}"/></c:if>/<%= pageContext.getAttribute("thisTrim").toString().replaceAll("([^A-Za-z0-9 _-]+)", " ") %>~ratings.jsp</atc_util:seoUrlEscape>?<c:if test="${!empty param.styleId}">vehicle_number=<c:out value="${param.styleId}"/>&</c:if>ad_min_price=<c:out value="${param.ad_min_price}"/>&ad_max_price=<c:out value="${param.ad_max_price}"/>
    //    reviewUrl.replaceAll("([^a-zA-Z0-9_\\./~-])", "-");
        //write reviews //innerHTML a div

        //build and price - conditionally shown
        //?.innerHTML = ì/research/configure/trimselection.jsp? yearSelect= ì+style.year+î &makeSelect= style.makeî+ &modelSelect= ì+style.model;


        //TODO add chrome ID details population, remove temporary data display
/*            var chromeDetails;
            for(var chromeId in style.featureMap){
                    chromeDetails += "<br />"+chromeId+"::"+style.featureMap[chromeId];
                }
            var td = $('result' + column);
            var table = document.createElement('table');
            ATC.cs.research.ct.CompareTool.prototype.addValueToDisplayTable('style.featureMap', chromeDetails, table);
            td.appendChild(table);*/

        //TODO update differnces tab

        //TODO image hovers for photos chrome ID details section
        // var tip360URL = "360URL";
        //ATC.cs.research.ct.CompareTool.prototype.addHovers (el, tipTitle, tip360URL, style.pictures[0].fileName, column);
        //addHovers (el, tipTitle, tip360URL, style.featureMap[?].fileName);


        //TODO show this column
        //remove/hide the pending status style loading icon
        //$$('td.compare_'+column).invoke('show');
        $$('td.compare_'+column).invoke('addClassName', 'visible');

        //TODO update social networking links
    };
//---------------------------------------------------------------------------------------------------------------------
    /**
    * DWR lookup returning a list of style objects to write data to populate styles dropdown in a column.
    * @param year
    * @param make
    * @param model
    * @param column
    */
ATC.cs.research.ct.CompareTool.prototype.updateStyles = function (year, make, model, column) {
        var callback = function(styles) {
            var styleSelect = $('style_'+column);

            if(styleSelect) {

                while (styleSelect.length > 0) {
                    styleSelect.remove(0);
                }
                styles.each(function (style) {
                    var option = $(document.createElement('option'));
                    option.text = style.style;
                    option.value = style.styleId;
                    try {
                        styleSelect.add(option, null); //standards compliant
                    } catch(ex) {
                        styleSelect.add(option); //IE only
                    }
                })
                //styleChanged();
            }
        }
        ModelSearchUtil.findStylesByYearMakeModel(year, make, model, callback);
    };
//---------------------------------------------------------------------------------------------------------------------
    /**
    * Adds the picture, using the scaler URL, and a hover.
    * @param style a style object
    * @param column the column to populate 1,2,3,4
    */
ATC.cs.research.ct.CompareTool.prototype.addPictureToMain = function (style, column) {
        var imgUrl = '/img/research/mir/no_photo_120x76.gif';
        var imgAlt = '';
        var el = $('imgurl-compare-'+column);
        if (style.pictures != null && style.pictures[0] != null) {
            imgUrl =  'http://images.autotrader.com/scaler/121/61/' + style.pictures[0].fileName;
            if(style.pictures[0].photoId != null) {
                imgAlt = style.pictures[0].photoId;
            }
        }
        el.src = imgUrl;
        el.alt = imgAlt;
        el.removeClassName("hidden");//.addClassName("show");
        //TODO img link url

        //main image Hovers
        //TODO 360 link
        var tipTitle = style.year + " " + style.make + " " + style.model;
        var tip360URL = "360URL";
//
        //"/research/car-models/<c:out value="${style.year}"/>-<c:out value="${style.make}"/>-<%= pageContext.getAttribute("thisModel").toString().replaceAll("([^A-Za-z0-9 _-]+)", " ") %>/<c:out value="${style.modelId}"/><c:if test="${!empty param.styleId}">-<c:out value="${param.styleId}"/></c:if><c:if test="${!empty param.hybrid}">-<c:out value="${param.hybrid}"/></c:if><c:if test="${!empty param.body_style}">-<c:out value="${param.body_style}"/></c:if>/<%= pageContext.getAttribute("thisTrim").toString().replaceAll("([^A-Za-z0-9 _-]+)", " ") %>~photos.jsp</atc_util:seoUrlEscape>?<c:if test="${!empty param.styleId}">vehicle_number=<c:out value="${param.styleId}"/>&</c:if>ad_min_price=<c:out value="${param.ad_min_price}"/>&ad_max_price=<c:out value="${param.ad_max_price}"/>"><%= resourcebundle.getString("link.action_items_photos") %></a>
        //tip360URL.replaceAll("([^a-zA-Z0-9_\\./~-])", "-");

        ATC.cs.research.ct.CompareTool.prototype.addHovers (el, tipTitle, tip360URL, style.pictures[0].fileName, column);

    };
//---------------------------------------------------------------------------------------------------------------------
    /**
    * Adds the stars and ratings.
    * @param style a style object
    * @param column the column to populate 1,2,3,4
    */
ATC.cs.research.ct.CompareTool.prototype.addRatingToMain = function (style, column) {
        var elRatingImg = $("customer-ratings-and-reviews").down("td.compare_"+column+" span img");
        var cRoR = style.consumerRatings.overallRating;
        var cRoRBaseURL = "/img/research/reviews/";
        var cRoRimg = "stars05.gif";
        var cRoRalt = "Not Tested";//style.safety.driverCrashGradeRating
        //javascript version of ratings-logic.jsp
        switch (true) {
            case (cRoR == null || ( cRoR != null && (isNaN(cRoR) || cRoR == 0.0 || cRoR.empty) )  ):
                cRoRimg = "stars05.gif";
                cRoRalt = "Not Tested";
            break;
            case (cRoR >= 4.75 && cRoR <= 5.0):
                cRoRimg = "stars05.gif";
                cRoRalt = "Excellent";
            break;
            case (cRoR > 4.25 && cRoR < 4.75):
                cRoRimg = "stars04_5.gif";
                cRoRalt = "Good";
            break;
            case (cRoR > 3.75 && cRoR <= 4.25):
                cRoRimg = "stars04.gif";
                cRoRalt = "Average";
            break;
            case (cRoR > 3.25 && cRoR < 3.75):
                cRoRimg = "stars03_5.gif";
                cRoRalt = "Average";
            break;
            case (cRoR > 2.75 && cRoR < 3.25):
                cRoRimg = "stars03.gif";
                cRoRalt = "Average";
            break;
            case (cRoR > 2.25 && cRoR < 2.75):
                cRoRimg = "stars02_5.gif";
                cRoRalt = "Poor";
            break;
            case (cRoR > 1.75 && cRoR < 2.25):
                cRoRimg = "stars02.gif";
                cRoRalt = "Poor";
            break;
            case (cRoR > 1.25 && cRoR < 1.75):
                cRoRimg = "stars01_5.gif";
                cRoRalt = "Very Poor";
            break;
            case (cRoR >= 1.0 && cRoR < 1.25):
                cRoRimg = "stars01.gif";
                cRoRalt = "Very Poor";
            break;
            default:
                cRoRimg = "stars05.gif";
                cRoRalt = "Not Tested";
        }
        if(cRoRalt == "Not Tested") {
            //hide image
            elRatingImg.removeClassName("show").addClassName("hidden");
            //hide text Read Reviews
            $("compare_"+column+"_stars").removeClassName("show").addClassName("hidden");
            $("compare_"+column+"_reviews").removeClassName("show").addClassName("hidden");
            $("compare_"+column+"_read_reviews").removeClassName("show").addClassName("hidden");
        } else {
            //show image
            elRatingImg.src = cRoRBaseURL + cRoRimg;
            elRatingImg.alt = cRoRalt;
            elRatingImg.removeClassName("hidden").addClassName("show");
            //show text Read Reviews
            $("compare_"+column+"_stars").innerHTML = cRoR + " of 5";
            $("compare_"+column+"_reviews").innerHTML = "Based on " +  style.consumerRatings.consumerreviewcount + " Review(s)";
            $("compare_"+column+"_read_reviews").href = "/compare_models/compare_tool";
            $("compare_"+column+"_write_reviews").href = "/compare_models/compare_tool";
            $("compare_"+column+"_stars").removeClassName("hidden").addClassName("show");
            $("compare_"+column+"_reviews").removeClassName("hidden").addClassName("show");
            $("compare_"+column+"_read_reviews").removeClassName("hidden").addClassName("show");
        }
    };
//---------------------------------------------------------------------------------------------------------------------
    /**
    * Decides which rows in the details section to roll up or show.
    * @param style1 a style object
    * @param style2 a style object
    * @param style3 a style object
    * @param style4 a style object
    */
ATC.cs.research.ct.CompareTool.prototype.expandCollapseRows = function (style1,style2,style3,style4) {
        //TODO use as a displayModelInfo callback
        //loop through each style object and compare rows across all styles on the page
        //decide which rows to expand or collaps due to data being present or not
        //create array of all the elements (or get from CMS)
        //group = false (like interior)
        //rowFeatureMapID = false (like 1234)
        //loop pretend obj?
        //if not empty style1 row || style2 row || style3 row || style4 row
            //group = true
            //rowFeatureMapID = true

        //execute function on all elements in array that are true
            //show rows that are true
            //show groups that are true
        //execute function on all elements in array that are false
            //collapse rows that are false
            //collapse groups that are false

    };
//---------------------------------------------------------------------------------------------------------------------
    /**
     * adds hover to image
      * @param element
      * @param tipTitle
      * @param tip360URL
      * @param tipImgFilename
      * @param column
    */
ATC.cs.research.ct.CompareTool.prototype.addHovers = function (element, tipTitle, tip360URL, tipImgFilename, column) {
        var tip360URLlink = (tip360URL=='NO360URL')?'':'<ul><li><a href="' + tip360URL + '">View more photos and 360 spins</a></li></ul>';
        var tipImgURL = "http://images.autotrader.com/scaler/200/101/" + tipImgFilename;
        var tipTemplate = '<img src="'+tipImgURL+'" />' + tip360URLlink;
        var tipClass = (column <= 2) ? "rightTip" : "leftTip";
        var tipOffsetX = (column <= 2) ? 50 : -260;
        var tipHookTarget = (column <= 2) ? "'bottomRight'" : "'bottomRight'";
        var tipHookTip = (column <= 2) ? "'topLeft'" : "'topLeft'";

        new Tip(element, tipTemplate, {
                title : tipTitle,
                className: tipClass,
                delay: 0.5,
                effect: 'appear',
                closeButton: true,
                hideOn: false,
                hideAfter: 3,
                viewport: true,
                hook: {target: tipHookTarget, tip: tipHookTip },
                offset: {x:tipOffsetX, y:-150}
            });

    };
//---------------------------------------------------------------------------------------------------------------------
    /**
     * toggles visibility
      * @param tog is an element
    */
ATC.cs.research.ct.CompareTool.prototype.toggleAttributes = function (tog) {
        $$(tog).invoke('toggle');
    };
ATC.cs.research.ct.CompareTool.prototype.toggleLinkText = function (linktext) {
        (linktext.innerHTML == "View") ? linktext.innerHTML = "Hide" : linktext.innerHTML = "View";
    };
ATC.cs.research.ct.CompareTool.prototype.closeOthers = function () {
        $$('#data-table tr.attribute-row').invoke('hide');
    };
ATC.cs.research.ct.CompareTool.prototype.viewAllAttributes = function () {
        $$('#data-table tr.attribute-row').invoke('toggle');
    };
//---------------------------------------------------------------------------------------------------------------------

     /**
     * Cleans a string.
     * @param s a string to be cleaned.
     * @return s or an empty string if s is null.
     */
ATC.cs.research.ct.CompareTool.prototype.cleanString = function (s) {
        if(s == null)
        {
            return "";
        }
        return s;
    };
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

//Compare-Selection event methods

    ATC.cs.research.ct.CompareTool.prototype.zipValidation = function(evt) {
        var child = Event.element(evt);
        alert('change zip');
    };
//---------------------------------------------------------------------------------------------------------------------
    ATC.cs.research.ct.CompareTool.prototype.clearAll = function(evt) {
        $$('th.compare-1','th.compare-2', 'th.compare-3', 'th.compare-4','td.compare-1','td.compare-2', 'td.compare-3', 'td.compare-4').each(
            function(element) {
              element.setStyle({
                'background' : 'none'
              });
              element.addClassName('hidden');
        });
    };
//---------------------------------------------------------------------------------------------------------------------
    ATC.cs.research.ct.CompareTool.prototype.buttonAddClick = function(evt) {
        var child = Event.element(evt);
        //this?
        this.up('span').next('span').show();//child.up().previous("span.ultra-pop").show();
        var theColumnNumber = this.up('td').className.slice(8);

        this.up('table').down('th.compare-'+theColumnNumber).addClassName('hidden');

        $('price').down('td.compare-'+theColumnNumber).addClassName('hidden').setStyle({'background' : 'none'});
        $('fuel-mileage').down('td.compare-'+theColumnNumber).addClassName('hidden').setStyle({'background' : 'none'});
        $('customer-ratings-and-reviews').down('td.compare-'+theColumnNumber).addClassName('hidden').setStyle({'background' : 'none'});
        $('next-steps').down('td.compare-'+theColumnNumber).addClassName('hidden').setStyle({'background' : 'none'});

        //Event.stop(evt); //avids another call related to the parent_node itself (like return false on an href
    };
//---------------------------------------------------------------------------------------------------------------------
    ATC.cs.research.ct.CompareTool.prototype.radioSuggestClick = function(evt) {
        var child = Event.element(evt);
        //TODO replace this with child?
        var theColumnNumber = this.up('td').className.slice(8);
        this.up('td.compare-'+theColumnNumber).down('span.suggestions').highlight();
        //Event.stop(evt); //avids another call related to the parent_node itself (like return false on an href
    };
//---------------------------------------------------------------------------------------------------------------------
    ATC.cs.research.ct.CompareTool.prototype.togglerClick = function(evt) {
        //TODO toggle show/hide details rows
        alert(this.inspect());
    };
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.makeChanged = function(evt) {
    //TODO get the one that changed (column 1,2,3,4)
    var child = Event.element(evt);
    var make = child.value;//$F('make');
    var modelDD = child.up('span').next('span').down('select.model');//$('model');
    var theColumn = child.up('td').className;//.slice(8)
    // alert(theColumn)

    ATC.cs.research.ct.CompareTool.prototype.resetMYSB(theColumn);
    ATC.cs.research.ct.CompareTool.prototype.updateModels(make, modelDD);
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.modelChanged = function(evt) {
    var child = Event.element(evt);
    var make = child.up('span').previous('span').down('select.make').value;//$F('make');
    var model = child.value;//$F('model')
    var theColumn = child.up('td').className

    if(model=="") {//"Select One"
        ATC.cs.research.ct.CompareTool.prototype.resetMYSB(theColumn);
    } else {
        ATC.cs.research.ct.CompareTool.prototype.updateYears(make, model, theColumn);
    }
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.resetMYSB = function(theColumn) {
        var yearSelect = $$('td.'+theColumn+' select.year')[0];//$('year');
        var styleSelect = $$('td.'+theColumn+' select.style-select')[0];//$('style');
        var submitButton = $$('td.'+theColumn+' input.add-style')[0];//$('add');

        DWRUtil.removeAllOptions(yearSelect);
        DWRUtil.removeAllOptions(styleSelect);

        yearSelect.disabled = true;
        styleSelect.disabled = true;
        submitButton.disabled= true;
        submitButton.addClassName("disabled");

};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.yearChanged = function(evt) {
    var child = Event.element(evt);
    var make = child.up('span').previous('span',1).down('select.make').value;//$F('make');
    var model = child.up('span').previous('span').down('select.model').value;//$F('model')
    var year = child.value;//$F('year');
    var theColumn = child.up('td').className
    //TODO Default to base trim updateStyles used above
    ATC.cs.research.ct.CompareTool.prototype.updateAddStyles(year, make, model, theColumn);
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.styleChanged = function(evt) {
    //alert('styleChanged');
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateModels = function(make, modelDD) {
    DWRUtil.removeAllOptions(modelDD);
    modelDD.options[0] = new Option('Select One', '');

    callback = function(models) {
        DWRUtil.addOptions(modelDD, models);
        modelDD.disabled = false;
    }

    if (make == null || make == '') {
        DWRUtil.removeAllOptions(modelDD);
        modelDD.options[0] = new Option('Select One', '');
        modelDD.disabled = true;
    } else {
        ModelSearchUtil.getAllModels(make, callback);
    }
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateYears = function(make, model, theColumn) {
    var callback = function(years) {
        var yearSelect = $$('td.'+theColumn+' select.year')[0];//$('year');

        yearSelect.disabled = false;

        while (yearSelect.length > 0) {
            yearSelect.remove(0);
        }
        years.each( function (num) {
            var option = $(document.createElement('option'));
            option.text = num;
            try {
                yearSelect.add(option, null); // standards compliant
            } catch(ex) {
                year.add(option); // IE only
            }
        })
        //TODO fire event change yearSelect
        yearSelect.fire("change");
        //ATC.cs.research.ct.CompareTool.prototype.yearChanged();
    }
    ModelSearchUtil.getYearsByMakeModel(make, model, callback);

};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateAddStyles = function(year, make, model, theColumn) {
    //TODO SE confirm this hopefully defaults to base trim
    var callback = function(styles) {
        var styleSelect = $$('td.'+theColumn+' select.style-select')[0];//$('style');
        var submitButton = $$('td.'+theColumn+' input.add-style')[0];//$('add');

        //styleSelect.disabled = false;
        submitButton.disabled= false;
        submitButton.removeClassName('disabled');


        while (styleSelect.length > 0) {
            styleSelect.remove(0);
        }
        styles.each(function (style) {
            var option = $(document.createElement('option'));
            option.text = style.style;
            option.value = style.styleId;
            try {
                styleSelect.add(option,null); // standards compliant
            } catch(ex) {
                styleSelect.add(option); // IE only
            }
        });
        ATC.cs.research.ct.CompareTool.prototype.styleChanged();
    }
    ModelSearchUtil.findStylesByYearMakeModel(year, make, model, callback);
};
//---------------------------------------------------------------------------------------------------------------------
//TODO handle suggested vehicles in column
ATC.cs.research.ct.CompareTool.prototype.addVehiclesOthersConsidered = function(vehicles) {
    others.push(vehicles);
    ATC.cs.research.ct.CompareTool.prototype.updateVehiclesOthersConsidered();
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.addVehiclesPreviouslyViewed = function(previewedStyles) {
    ATC.cs.research.ct.CompareTool.prototype.updateVehicleList($('previous-vehicles-list'), previewedStyles);
    $('previous-vehicles-content').removeClassName('inactive');
};
//---------------------------------------------------------------------------------------------------------------------

ATC.cs.research.ct.CompareTool.prototype.updateVehiclesOthersConsidered = function() {

    var callback = function(others) {
        ATC.cs.research.ct.CompareTool.prototype.updateVehicleList($('others-considered'), others);
        // $('select-others-considered-content').removeClassName('inactive');
    }

    var otherStyles = new Array();
    if (others != null) {
        for (var i = 0; i < others.length; i ++) {
            if (others[i] != null && others[i] != 0) {
                for (var j = 0; j < others[i].length; j++) {
                    otherStyles[otherStyles.length] = others[i][j];
                }
            }
        }
    }

    if (otherStyles.length > 0) {
        ModelSearchUtil.findStyles(otherStyles.reverse(false), callback);
    } else {
        $('user-vehicles-list').innerHTML = '<li class="inactive">We don\'t currently have any vehicles others considered that match the one you\'re looking for.</li>';
        $('select-others-considered-content').addClassName('inactive');
    }

};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateSimilarVehicles = function() {
    var callback = function(styles) {
        ATC.cs.research.ct.CompareTool.prototype.updateVehicleList($('similar-vehicles-list'), styles);
        $('select-similar-content').removeClassName('inactive');
    }

    var similarStyles = new Array();
    //could be null on remove all
    if (styles != null) {
        for (i = 0; i < styles.length; i ++) {
            if (styles[i] != null && styles[i] != 0) {
                similarStyles[similarStyles.length] = styles[i];
            }
        }
    }

    if (similarStyles.length > 0) {
        // reverse the array so newly added models are at the top
        // (make sure to use the non-destructive version by passing false!)
        ModelSearchUtil.searchBySimilarity(similarStyles.reverse(false), callback);
    } else {
        $('similar-vehicles-list').innerHTML = '<li class="inactive">There are currently no similar vehicles to view.</li>';
        $('select-similar-content').addClassName('inactive');
    }
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateVehicleList = function(list, styles) {
    list.innerHTML = '';
    if (styles != null) {
        styles.each(function (style) {
            var styleText = '<p style="float:left">' + style.year + ' ' + style.make + ' ' + style.model + ' ' + style.style + '</p><span><a href="#" onclick="addStyle(' + style.styleId + ');return false;">Select</a></span>';
            var li = $(document.createElement('li'));
            //li.appendChild(document.createTextNode(styleText));
            li.innerHTML = styleText;
            li.addClassName('clear');
            list.appendChild(li);
        });
    }
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.addStyle = function(style) {
    var callback = function(style) {
        //TODO FIX IT called in compare_buffer.js to populate the MI compare buffer onload- also vehicle_number1 parameter being populated 2 ways on back button
        if(compareList.length == 4){
            alert("You cannot select more than 4 cars to compare at once.");
        } else {
            ATC.cs.research.ct.CompareTool.prototype.addStyleToCompare(style);

            styles.push(style.styleId);
            ATC.cs.research.ct.CompareTool.prototype.updateStylesInput();
            ATC.cs.research.ct.CompareTool.prototype.updateSimilarVehicles();
            ATC.cs.research.ct.CompareTool.prototype.addVehiclesOthersConsidered(style.consumerActivityHistory);

            var theOne = compareList.length - 1;
            $('compare_' + theOne).highlight({startcolor:'#ff6600', endcolor:'#ffffff', duration: 1.5});
            $('number_compared').innerHTML = "1-" + compareList.length + " of 4";
            $('make').value = "";
            ATC.cs.research.ct.CompareTool.prototype.makeChanged();

            //TODO integrate trim into MI buffer like CTR buffer for MI selection set only
            $("trim_compare_" + theOne).innerHTML = style.style.truncate(25);
            $("compare_close_" + theOne).style.display = "block";
        }

        //added changeVehicleZip() at end to enable compare button if 2 cars and valid zip
         //ATC.cs.research.ct.CompareTool.prototype.changeVehicleZip();
         if (compareList.length >= 1 ){
             $('remove-all').show();
         }
    }

    ModelSearchUtil.findStyle(style, callback);
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.removeStyle = function(styleNum) {
    //some depend on array styles[] and others[], buffer depends on compareList[]
    if(styles != null) {
       styles.splice(styleNum, 1);//styles[styleNum] = null;//0;
    }
    if(others != null) {
       others.splice(styleNum, 1);//others[position] = null;
    }

    ATC.cs.research.ct.CompareTool.prototype.updateStylesInput();

    //TODO integrate trim into MI buffer like CTR buffer for MI selection set only
    $("trim_compare_" + styleNum).innerHTML = "";

    ATC.cs.research.ct.CompareTool.prototype.removeFromCompare(styleNum);//compare-buffer.js
    ATC.cs.research.ct.CompareTool.prototype.updateSimilarVehicles();
    ATC.cs.research.ct.CompareTool.prototype.updateVehiclesOthersConsidered();

    //disable button IF less than 2 cars in buffer
    if( compareList.length < 2 ){
        //enable button
        submitButton.disabled= true;
        submitButton.addClassName('disabled');
    }
    if (compareList.length < 1 ){
        $('remove-all').hide();
    }
    $('number_compared').innerHTML = (compareList.length<1?"0":"1") + "-" + compareList.length + " of 4";
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.updateStylesInput = function() {
    $('stylesToCompare').value = styles;
};
//---------------------------------------------------------------------------------------------------------------------
ATC.cs.research.ct.CompareTool.prototype.removeAllStyles = function() {
    $('stylesToCompare').value = null;
    styles.length = 0;
    others.length = 0;
    for(var i = compareList.length-1; i>=0; i--){
        ATC.cs.research.ct.CompareTool.prototype.removeStyle(i);
    }
    $('remove-all').hide();
};
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

//end of class CT
