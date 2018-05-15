(function (a, b) {
    var c = 0;
    a.widget("ui.suggestion", {
        version: "1.9.2",
        defaultElement: "<input>",
        options: {
            appendTo: "body",
            autoFocus: false,
            delay: 300,
            minLength: 1,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "none"
            },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        pending: 0,
        _create: function () {
            var e, d, f;
            this.isMultiLine = this._isMultiLine();
            this.valueMethod = this.element[this.element.is("input,textarea") ? "val" : "text"];
            this.isNewMenu = true;
            this.element.addClass("ui-suggestion-input").attr("suggestion", "off");
            this._on(this.element, {
                keydown: function (g) {
                    if (this.element.prop("readOnly")) {
                        e = true;
                        f = true;
                        d = true;
                        return
                    }
                    e = false;
                    f = false;
                    d = false;
                    var h = a.ui.keyCode;
                    switch (g.keyCode) {
                    case h.PAGE_UP:
                        e = true;
                        this._move("previousPage", g);
                        break;
                    case h.PAGE_DOWN:
                        e = true;
                        this._move("nextPage", g);
                        break;
                    case h.UP:
                        e = true;
                        this._keyEvent("previous", g);
                        break;
                    case h.DOWN:
                        e = true;
                        this._keyEvent("next", g);
                        break;
                    case h.ENTER:
                    case h.NUMPAD_ENTER:
                        if (this.menu.active) {
                            e = true;
                            g.preventDefault();
                            this.menu.select(g)
                        }
                        break;
                    case h.TAB:
                        if (this.menu.active) {
                            this.menu.select(g)
                        }
                        break;
                    case h.ESCAPE:
                        if (this.menu.element.is(":visible")) {
                            this._value(this.term);
                            this.close(g);
                            g.preventDefault()
                        }
                        break;
                    default:
                        d = true;
                        this._searchTimeout(g);
                        break
                    }
                },
                keypress: function (g) {
                    if (e) {
                        e = false;
                        g.preventDefault();
                        return
                    }
                    if (d) {
                        return
                    }
                    var h = a.ui.keyCode;
                    switch (g.keyCode) {
                    case h.PAGE_UP:
                        this._move("previousPage", g);
                        break;
                    case h.PAGE_DOWN:
                        this._move("nextPage", g);
                        break;
                    case h.UP:
                        this._keyEvent("previous", g);
                        break;
                    case h.DOWN:
                        this._keyEvent("next", g);
                        break
                    }
                },
                input: function (g) {
                    if (f) {
                        f = false;
                        g.preventDefault();
                        return
                    }
                    this._searchTimeout(g)
                },
                focus: function () {
                    this.selectedItem = null;
                    this.previous = this._value()
                },
                blur: function (g) {
                    if (this.cancelBlur) {
                        delete this.cancelBlur;
                        return
                    }
                    clearTimeout(this.searching);
                    this.close(g);
                    this._change(g)
                }
            });
            this._initSource();
			var twidth = this.element.outerWidth() - 2;
			console.log(twidth);
            //this.menu = a("<ul>").width(twidth).addClass("ui-suggestion").appendTo(this.document.find(this.options.appendTo || "body")[0]).menu({
            this.menu = a("<ul>").css("min-width",twidth).addClass("ui-suggestion").appendTo(this.document.find(this.options.appendTo || "body")[0]).menu({
                input: a(),
                role: null
            }).zIndex(this.element.zIndex() + 1).hide().data("menu");
            this._on(this.menu.element, {
                mousedown: function (g) {
                    g.preventDefault();
                    this.cancelBlur = true;
                    this._delay(function () {
                        delete this.cancelBlur
                    });
                    var h = this.menu.element[0];
                    if (!a(g.target).closest(".ui-menu-item").length) {
                        this._delay(function () {
                            var i = this;
                            this.document.one("mousedown", function (j) {
                                if (j.target !== i.element[0] && j.target !== h && !a.contains(h, j.target)) {
                                    i.close()
                                }
                            })
                        })
                    }
                },
                menufocus: function (h, i) {
                    if (this.isNewMenu) {
                        this.isNewMenu = false;
                        if (h.originalEvent && /^mouse/.test(h.originalEvent.type)) {
                            this.menu.blur();
                            this.document.one("mousemove", function () {
                                a(h.target).trigger(h.originalEvent)
                            });
                            return
                        }
                    }
                    var g = i.item.data("ui-suggestion-item") || i.item.data("item.suggestion");
                    if (false !== this._trigger("focus", h, {
                        item: g
                    })) {
                        if (h.originalEvent && /^key/.test(h.originalEvent.type)) {
                            this._value(g.value)
                        }
                    } else {
                        this.liveRegion.text(g.value)
                    }
                },
                menuselect: function (i, j) {
                    var h = j.item.data("ui-suggestion-item") || j.item.data("item.suggestion"),
                        g = this.previous;
                    if (this.element[0] !== this.document[0].activeElement) {
                        this.element.focus();
                        this.previous = g;
                        this._delay(function () {
                            this.previous = g;
                            this.selectedItem = h
                        })
                    }
                    if (false !== this._trigger("select", i, {
                        item: h
                    })) {
                        this._value(h.value)
                    }
                    this.term = this._value();
                    this.close(i);
                    this.selectedItem = h
                }
            });
            this.liveRegion = a("<span>", {
                role: "status",
                "aria-live": "polite"
            }).addClass("ui-helper-hidden-accessible").insertAfter(this.element);
            if (a.fn.bgiframe) {
                this.menu.element.bgiframe()
            }
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("suggestion")
                }
            })
        },
        _destroy: function () {
            clearTimeout(this.searching);
            this.element.removeClass("ui-suggestion-input").removeAttr("suggestion");
            this.menu.element.remove();
            this.liveRegion.remove()
        },
        _setOption: function (d, e) {
            this._super(d, e);
            if (d === "source") {
                this._initSource()
            }
            if (d === "appendTo") {
                this.menu.element.appendTo(this.document.find(e || "body")[0])
            }
            if (d === "disabled" && e && this.xhr) {
                this.xhr.abort()
            }
        },
        _isMultiLine: function () {
            if (this.element.is("textarea")) {
                return true
            }
            if (this.element.is("input")) {
                return false
            }
            return this.element.prop("isContentEditable")
        },
        _initSource: function () {
            var f, d, e = this;
            if (a.isArray(this.options.source)) {
                f = this.options.source;
                this.source = function (h, g) {
                    g(a.ui.suggestion.filter(f, h.term))
                }
            } else {
                if (typeof this.options.source === "string") {
                    d = this.options.source;
                    this.source = function (h, g) {
                        if (e.xhr) {
                            e.xhr.abort()
                        }
                        e.xhr = a.ajax({
                            url: d,
                            data: h,
                            dataType: "json",
                            success: function (i) {
                                g(i)
                            },
                            error: function () {
                                g([])
                            }
                        })
                    }
                } else {
                    this.source = this.options.source
                }
            }
        },
        _searchTimeout: function (d) {
            clearTimeout(this.searching);
            this.searching = this._delay(function () {
                if (this.term !== this._value()) {
                    this.selectedItem = null;
                    this.search(null, d)
                }
            }, this.options.delay)
        },
        search: function (e, d) {
            e = e != null ? e : this._value();
            this.term = this._value();
            if (e.length < this.options.minLength) {
                return this.close(d)
            }
            if (this._trigger("search", d) === false) {
                return
            }
            return this._search(e)
        },
        _search: function (d) {
            this.pending++;
            this.element.addClass("ui-suggestion-loading");
            this.cancelSearch = false;
            this.source({
                term: d
            }, this._response())
        },
        _response: function () {
            var e = this,
                d = ++c;
            return function (f) {
                if (d === c) {
                    e.__response(f)
                }
                e.pending--;
                if (!e.pending) {
                    e.element.removeClass("ui-suggestion-loading")
                }
            }
        },
        __response: function (d) {
            if (d) {
                d = this._normalize(d)
            }
            this._trigger("response", null, {
                content: d
            });
            if (!this.options.disabled && d && d.length && !this.cancelSearch) {
                this._suggest(d);
                this._trigger("open")
            } else {
                this._close()
            }
        },
        close: function (d) {
            this.cancelSearch = true;
            this._close(d)
        },
        _close: function (d) {
            if (this.menu.element.is(":visible")) {
                this.menu.element.hide();
                this.menu.blur();
                this.isNewMenu = true;
                this._trigger("close", d)
            }
        },
        _change: function (d) {
            if (this.previous !== this._value()) {
                this._trigger("change", d, {
                    item: this.selectedItem
                })
            }
        },
        _normalize: function (d) {
            if (d.length && d[0].label && d[0].value) {
                return d
            }
            return a.map(d, function (e) {
                if (typeof e === "string") {
                    return {
                        label: e,
                        value: e
                    }
                }
                return a.extend({
                    label: e.label || e.value,
                    value: e.value || e.label
                }, e)
            })
        },
        _suggest: function (d) {
            var e = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
            this._renderMenu(e, d);
            this.menu.refresh();
            e.show();
            this._resizeMenu();
            e.position(a.extend({
                of: this.element
            }, this.options.position));
            if (this.options.autoFocus) {
                this.menu.next()
            }
        },
        _resizeMenu: function () {
            var d = this.menu.element;
			//console.log("_resizeMenu")
			//d.outerWidth(Math.max(d.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function (e, d) {
            var f = this;
            a.each(d, function (g, h) {
                f._renderItemData(e, h)
            })
        },
        _renderItemData: function (d, e) {
            return this._renderItem(d, e).data("ui-suggestion-item", e)
        },
        _renderItem: function (d, e) {
            return a("<li>").append(a("<a>").text(e.label)).appendTo(d)
        },
        _move: function (e, d) {
            if (!this.menu.element.is(":visible")) {
                this.search(null, d);
                return
            }
            if (this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e)) {
                this._value(this.term);
                this.menu.blur();
                return
            }
            this.menu[e](d)
        },
        widget: function () {
            return this.menu.element
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function (e, d) {
            if (!this.isMultiLine || this.menu.element.is(":visible")) {
                this._move(e, d);
                d.preventDefault()
            }
        }
    });
    a.extend(a.ui.suggestion, {
        escapeRegex: function (d) {
            return d.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        },
        filter: function (f, d) {
            var e = new RegExp(a.ui.suggestion.escapeRegex(d), "i");
            return a.grep(f, function (g) {
                return e.test(g.label || g.value || g)
            })
        }
    });
    a.widget("ui.suggestion", a.ui.suggestion, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (d) {
                    return d + (d > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        },
        __response: function (e) {
            var d;
            this._superApply(arguments);
            if (this.options.disabled || this.cancelSearch) {
                return
            }
            if (e && e.length) {
                d = this.options.messages.results(e.length)
            } else {
                d = this.options.messages.noResults
            }
            this.liveRegion.text(d)
        }
    })
}(jQuery));