Template.create_meme.events({
	"submit .add-meme-details": function(event){
    	event.preventDefault();
        var name = event.target.name.value;
        var top_text = event.target.top_text.value;
        var bottom_text = event.target.bottom_text.value;
        var image_url = event.target.image_url.value;

        var img = document.getElementById('meme'); 
        //or however you get a handle to the IMG
        var nheight = img.naturalHeight;
        var nwidth = img.naturalWidth;
        console.log("width:" + nwidth);
        console.log("height:" + nheight);

        top_text = top_text.toUpperCase();
        bottom_text = bottom_text.toUpperCase();

        var Edited_meme_id= Edited_Memes.insert({
                name: name,
                top_text: top_text,
                bottom_text: bottom_text,
                image_url: image_url,
                user: Meteor.userId(),
                img_width: nwidth,
                img_height: nheight,
                createdAt: new Date()
            });
            toastr.info(top_text +"-"+ bottom_text,"Input taken:");


        event.target.name.value = "";
        event.target.top_text.value = "";
        event.target.bottom_text.value="";

        Router.go('/savememe/' + Edited_meme_id);
        return false;
    }
});







/*
* OPTIONS
*
* delay        *millisecond before apply filter*
* minLength    *min string lentgh searched*
* initial      *search only initial text (default: true)*
* eventKey     *event digit (default: 'keyup')*
* resetOnBlur  *auto reset selection*
* sourceData   *function generate data source(receive: text, callback)*
* sourceTmpl   *html template contains {title} placeholder*
* sourceNode   *function builder DOM html fragment (default: sourceTmpl)*
* emptyNode    *function builder for empty result*
* itemEl       *item selector (default: .list-group-item)*,
* itemChild    *sub item selector (default: .list-group-item)*,
* itemFilter   *function for filter results(receive: text, item)*
*/
(function($) {
    $.fn.btsListFilter = function(inputEl, opts) {

        'use strict';
        
        var self = this,
            searchlist$ = $(this),
            inputEl$ = $(inputEl),
            cancelEl$,
            items$ = searchlist$,
            callData,
            callReq;    //last callData execution

        function tmpl(str, data) {
            return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
                return data[key] || '';
            });
        }

        function defaultItemFilter(item, val) {
            val = val && val.replace(new RegExp("[({[^.$*+?\\\]})]","g"),'');
            //sanitize regexp

            var text = $(item).text(),
                i = opts.initial ? '^' : '',
                regSearch = new RegExp(i + val, opts.casesensitive ? '' : 'i');

            return regSearch.test( text );
        }
        
        opts = $.extend({
            delay: 300,
            minLength: 1,
            initial: true,
            casesensitive: false,
            eventKey: 'keyup',
            resetOnBlur: true,
            sourceData: null,
            //sourceTmpl: '<a class="list-group-item" href="#"><span>{title}</span></a>',
            sourceTmpl: '<a href="/create_meme/{{_id}}" class="create-meme"><div class="row"><div class="col-lg-2 col-md-2 col-sm-5 col-xs-5"><img src="{{image_url}}" width="100%" height="" class="img-thumbnail"></div><div class="col-lg-9 col-md-9 col-sm-5 col-xs-5"><h3><span>{title}</span></h3></div><div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><span class="pull-right fav btn btn-success">Fav</span><span class="pull-right"><a href="/edit/{{_id}}">Edit</a></span></div></div></a>',
            sourceNode: function(data) {
                return tmpl(opts.sourceTmpl, data);
            },
            emptyNode: function(data) {
                return '<a class="list-group-item well" href="#"><span>No Results</span></a>';
            },
            cancelNode: function() {
                return '<span class="btn glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>';
            },
            loadingClass: 'bts-loading-list',
            itemClassTmp: 'bts-dynamic-item',
            //itemEl: '.list-group-item',
            itemEl: '.create-meme',
            //itemChild: null,
            itemChild: '.row',
            itemFilter: defaultItemFilter
        }, opts);

        function debouncer(func, timeout) {
            var timeoutID;
            timeout = timeout || 300;
            return function () {
                var scope = this , args = arguments;
                clearTimeout( timeoutID );
                timeoutID = setTimeout( function () {
                    func.apply( scope , Array.prototype.slice.call( args ) );
                }, timeout);
            };
        }

        self.reset = function() {
            inputEl$.val('').trigger(opts.eventKey);
        };

        if($.isFunction(opts.cancelNode)) {

            cancelEl$ = $(opts.cancelNode.call(self)).hide();

            inputEl$.after( cancelEl$ );
            inputEl$.parents('.form-group').addClass('has-feedback');
            
            if(!inputEl$.prev().is('.control-label'))
                cancelEl$.css({top: 0});

            cancelEl$.css({'pointer-events': 'auto'});

            cancelEl$.on('click', self.reset);
        }

        inputEl$.on(opts.eventKey, debouncer(function(e) {
            
            var val = $(this).val();

            if(opts.itemEl)
                items$ = searchlist$.find(opts.itemEl);

            if(opts.itemChild)
                items$ = items$.find(opts.itemChild);

            var contains = items$.filter(function(){
                    return opts.itemFilter.call(self, this, val);
                }),
                containsNot = items$.not(contains);

            if (opts.itemChild){
                contains = contains.parents(opts.itemEl);
                containsNot = containsNot.parents(opts.itemEl).hide();
            }

            if(val!=='' && val.length >= opts.minLength)
            {
                contains.show();
                containsNot.hide();
                cancelEl$.show();

                if($.type(opts.sourceData)==='function')
                {
                    contains.hide();
                    containsNot.hide();
                    
                    if(callReq)
                    {
                        if($.isFunction(callReq.abort))
                            callReq.abort();
                        else if($.isFunction(callReq.stop))
                            callReq.stop();
                    }
                    
                    searchlist$.addClass(opts.loadingClass);
                    callReq = opts.sourceData.call(self, val, function(data) {
                        callReq = null;
                        contains.hide();
                        containsNot.hide();
                        searchlist$.find('.'+opts.itemClassTmp).remove();

                        if(!data || data.length===0)
                            $( opts.emptyNode.call(self, val) ).addClass(opts.itemClassTmp).appendTo(searchlist$);
                        else
                            for(var i in data)
                                $( opts.sourceNode.call(self, data[i]) ).addClass(opts.itemClassTmp).appendTo(searchlist$);

                        searchlist$.removeClass(opts.loadingClass);
                    });
                } 
                else {
                    searchlist$.find('.'+opts.itemClassTmp).remove();
                    
                    if(contains.length===0)
                        $( opts.emptyNode.call(self, val) ).addClass(opts.itemClassTmp).appendTo(searchlist$);
                }

            }
            else
            {
                contains.show();
                containsNot.show();
                cancelEl$.hide();
                searchlist$.find('.'+opts.itemClassTmp).remove();
            }
        }, opts.delay));

        if(opts.resetOnBlur)
            inputEl$.on('blur', function(e) {
                self.reset();
            });

        return searchlist$;
    };

})(jQuery);
