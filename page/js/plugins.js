/**
 * parallelRoll 左右无缝滚动
 * boxName : 最外层盒子类名
 * tagName : 滚动标签元素
 * time : 滚动间隔时间
 * direction : 滚动方向  right-->向右    left-->向左
 * visual : 可视数
 * prev : 上一张
 * next : 下一张
 * */
(function($) {
    $.fn.parallelRoll = function(options) {
        var opts = $.extend({}, $.fn.parallelRoll.defaults, options);
        var _this = this;
        var l = _this.find(opts.tagName).length;
        var autoRollTimer;
        var flag = true; // 防止用户快速多次点击上下按钮
        var arr = new Array();
        /**
         * 如果当  (可视个数+滚动个数 >滚动元素个数)  时  为不出现空白停顿   将滚动元素再赋值一次
         * 同时赋值以后的滚动元素个数是之前的两倍  2 * l.
         * */
        if (opts.amount + opts.visual > l) {
            _this[0].innerHTML += _this[0].innerHTML;
            l = 2 * l;
        } else {
            l = l;
        }
        var w = $(opts.tagName).outerWidth(true); //计算元素的宽度  包括补白+边框
        var h = $(opts.tagName).outerHeight(true); //计算元素的高度  包括补白+边框
        if (opts.direction == 'left' || opts.direction == 'right') {
            _this.css({ width: (l * w) + 'px' }); // 设置滚动层盒子的宽度
        } else if (opts.direction == 'up' || opts.direction == 'down') {
            _this.css({ height: (l * h) + 'px' }); // 设置滚动层盒子的高度
        }
        return this.each(function() {
            _this.closest('.' + opts.boxName).hover(function() {
                clearInterval(autoRollTimer);
            }, function() {
                switch (opts.direction) {
                    case 'left':
                        autoRollTimer = setInterval(function() {
                            left();
                        }, opts.time);
                        break;
                    case 'right':
                        autoRollTimer = setInterval(function() {
                            right();
                        }, opts.time);
                        break;
                    case 'up':
                        autoRollTimer = setInterval(function() {
                            up();
                        }, opts.time);
                        break;
                    case 'down':
                        autoRollTimer = setInterval(function() {
                            down();
                        }, opts.time);
                        break;
                    default:
                        alert('参数错误！');
                        break;
                }
            }).trigger('mouseleave');
            $('.' + opts.prev).on('click', function() {
                flag ? left() : "";
            });
            $('.' + opts.next).on('click', function() {
                flag ? right() : "";
            });
            $('.' + opts.up).on('click', function() {
                flag ? up() : "";
            });
            $('.' + opts.down).on('click', function() {
                flag ? down() : "";
            });
        });

        function left() {
            flag = false;
            _this.animate({ marginLeft: -(w * opts.amount) }, 1000, function() {
                _this.find(opts.tagName).slice(0, opts.amount).appendTo(_this);
                _this.css({ marginLeft: 0 });
                flag = true;
            });
        };

        function up() {
            flag = false;
            _this.animate({ marginTop: -(h * opts.amount) }, 1000, function() {
                _this.find(opts.tagName).slice(0, opts.amount).appendTo(_this);
                _this.css({ marginTop: 0 });
                flag = true;
            });
        };

        function right() {
            flag = false;
            arr = _this.find(opts.tagName).slice(-opts.amount);
            for (var i = 0; i < opts.amount; i++) {
                $(arr[i]).css({ marginLeft: -w * (i + 1) }).prependTo(_this);
            }
            _this.animate({ marginLeft: w * opts.amount }, 1000, function() {
                _this.find(opts.tagName).removeAttr('style');
                _this.css({ marginLeft: 0 });
                flag = true;
            });
        };

        function down() {
            flag = false;
            arr = _this.find(opts.tagName).slice(-opts.amount);
            for (var i = 0; i < opts.amount; i++) {
                $(arr[i]).css({ marginTop: -h * (i + 1) }).prependTo(_this);
            }
            _this.animate({ marginTop: h * opts.amount }, 1000, function() {
                _this.find(opts.tagName).removeAttr('style');
                _this.css({ marginTop: 0 });
                flag = true;
            });
        };
    };
    //插件默认选项
    $.fn.parallelRoll.defaults = {
        boxName: 'box',
        tagName: 'dd',
        time: 3000, // 
        direction: 'left', // 滚动方向
        visual: 7, //可视数
        prev: 'prev',
        next: 'next',
        up: 'up',
        down: 'down',
        amount: 1 // 滚动数  默认是1
    };
})(jQuery);
$(document).ready(function() {
    //首页展开功能-index
    $('.js-OpenBody').click(function(argument) {
        if ($(this).parents(".con").find(".js-conbody").hasClass("autoHeight")) {
            $(this).parents(".con").find(".js-conbody").removeClass("autoHeight");
            $(this).html("展开<i class='fa fa-caret-down ml5'></i>");
        } else {
            $(this).parents(".con").find(".js-conbody").addClass("autoHeight");
            $(this).html("关闭<i class='fa fa-caret-up ml5'></i>");
        }
    });
    //订购包数增加减少-xglist
    $('.js-addbtn').click(function() {
        var data = parseInt($(this).siblings('.priceInput').val());
        $(this).siblings('.priceInput').val(data + 1);
    });
    $('.js-minusbtn').click(function() {
        var data = parseInt($(this).siblings('.priceInput').val());
        if (data > 0) {
            $(this).siblings('.priceInput').val(data - 1);
        } else $(this).siblings('.priceInput').val(0);
    });
    //产品列表产品图片预览-xglist
    var _time_preview = null;
    $.extend({
        _previewHide: function() {
            $('.img-preview-box').hide();
        },
        _previewShow: function(_this) {
            _this.siblings('.img-preview-box').show();
        }
    });
    $('.btn-preview').mouseover(function() {
        var _this = $(this);
        $('.img-preview-box').hide();
        $._previewShow(_this);
        clearInterval(_time_preview);
    })
    $('.btn-preview').mouseout(function() {
        var _this = $(this);
        _time_preview = setInterval("$._previewHide()", 300)
    })
    $('.img-preview-box').mouseout(function() {
        $('.img-preview-box').hide();
    })
    $('.img-preview-box').mouseover(function() {
            clearInterval(_time_preview);
        })
        //手动关闭模态窗口
    $('.js-close-modal').click(function() {
        $('.modal').modal('hide')
    })
});
//购物车总价计算-shopping
$(document).ready(function() {
    var _total = 0;

    function Fcalculate(_this) {
        var price = parseInt(_this.text()) * parseInt(_this.parents('tr').find('input.js-bag-num[type="text"]').val());
        _total = _total + price;
    }
    $('.js-price').each(function() {
        var _this = $(this);
        Fcalculate(_this);
        $('#js-totle').html('总价：' + _total);
    });
    $('.js-minusbtn,.js-addbtn').click(function() {
        _total = 0;
        $('.js-price').each(function() {
            var _this = $(this);
            Fcalculate(_this);
        });
        $('#js-totle').html('总价：' + _total);
    });
    $('.js-bag-num').on('change', function() {
        _total = 0;
        $('.js-price').each(function() {
            var _this = $(this);
            Fcalculate(_this);
        });
        $('#js-totle').html('总价：' + _total);
    });
    /*全选*/
    $('input.listinput').on('ifUnchecked', function(event) {
        var minusprice = parseInt($(this).parents('tr').find('.js-price').text());
        _total = _total - minusprice;
        $('#js-totle').html('总价：' + _total);
        $('input.js-sel-all').iCheck('uncheck');
    });
    $('input.listinput').on('ifChecked', function(event) {
        var minusprice = parseInt($(this).parents('tr').find('.js-price').text());
        var $allcheck = $(this).parents('.prolisttable').find("input.listinput[type='checkbox']").length;
        var $checkednum = $(this).parents('.prolisttable').find("input.listinput[type='checkbox']:checked").length;
        _total = _total + minusprice;
        $('#js-totle').html('总价：' + _total);
        if ($allcheck == $checkednum) {
            $('input.js-sel-all').iCheck('check');
        }
    });
    $('input.js-sel-all').on('ifChecked', function(event) {
        $('input.js-sel-all').iCheck('check');
        $('.listinput').iCheck('check');
    });
    $('input.js-sel-all').on('ifUnchecked', function(event) {
        var $allcheck = $(this).parents('.prolisttable').find("input.listinput[type='checkbox']").length;
        var $checkednum = $(this).parents('.prolisttable').find("input.listinput[type='checkbox']:checked").length;
        $('input.js-sel-all').iCheck('uncheck');
        if ($allcheck == $checkednum) $('.listinput').iCheck('uncheck');
    });
    /*删除-单个删除*/
    $('.js-del-one').click(function() {
        var minusprice = parseInt($(this).parents('tr').find('.js-price').text());
        _total = _total - minusprice;
        $('#js-totle').html('总价：' + _total);
        $(this).parents("tr").remove();
        if ($('.prolisttable tr').length - 1 == 1) {
            $('input.js-sel-all').iCheck('uncheck');
        }
    })
    /*批量删除*/
    $('.js-del-more').click(function() {
        $("input.listinput[type='checkbox']:checked").each(function() {
            $(this).parents("tr").remove();
        });
        $('#js-totle').html('总价：' + 0);
        if ($('.prolisttable tr').length - 1 == 1) {
            $('input.js-sel-all').iCheck('uncheck');
        }
    })
});
/**
 * @description     表格排序实现
 **/
(function() {
    //#region 全局变量
    //初始化配置对象
    var _initConfig = null;
    var _tableObj = null,
        _tbodyObj = null,
        _tBodyIndex = 0;
    //存放当前各排序方式下的(有序)行数组的对象——仅在IsLazyMode=true，此变量有用
    var _trJqObjArray_Obj = null;
    //#endregion

    //#region 内部方法
    /**
     * 获得排序列值数组的方法
     * @private
     * @param trJqObjArr：(外部传入)存放排序行的数组，tdIndex：排序列的索引，td_valAttr：排序列的取值属性，td_dataType：排序列的值类型
     **/
    function GetOrderTdValueArray(trJqObjArr, tdIndex, td_valAttr, td_dataType) {
        var tdOrderValArr = new Array();
        var trObj, tdObj, tdVal;
        _tbodyObj.find("tr").each(function(trIndex, trItem) {
            trObj = $(trItem);
            trJqObjArr.push(trObj);

            tdObj = trObj.find("td")[tdIndex];
            tdObj = $(tdObj);
            tdVal = td_valAttr ? tdObj.attr(td_valAttr) : tdObj.text();
            tdVal = GetValue(tdVal, td_dataType);
            tdOrderValArr.push(tdVal);
        });
        return tdOrderValArr;
    }

    /**
     * 返回jQuery对象的方法
     * @private
     **/
    function GetJqObj(id) {
        return "string" == typeof(id) ? $("#" + id) : $(id);
    };

    /**
     * 排序方法
     * @private
     * @param tdIndex：排序列的索引,options：排序列的规则配置对象
     **/
    function Sort(tdIndex, options) {
        var trJqObjArr = null;
        if (_initConfig.IsLazyMode) {
            !_trJqObjArray_Obj && (_trJqObjArray_Obj = {});
            trJqObjArr = _trJqObjArray_Obj[tdIndex];
        }
        var isExist_trJqObjArr = true;
        if (!trJqObjArr) {
            isExist_trJqObjArr = false;
            trJqObjArr = new Array();
            var tdOrderValArr = GetOrderTdValueArray(trJqObjArr, tdIndex, options.ValAttr, options.DataType);
            var sort_len = tdOrderValArr.length - 1;
            var isExchanged = false,
                compareRes;
            for (var i = 0; i < sort_len; i++) {
                isExchanged = false;
                for (var j = sort_len; j > i; j--) {
                    compareRes = options.Desc ? (tdOrderValArr[j] > tdOrderValArr[j - 1]) : (tdOrderValArr[j] < tdOrderValArr[j - 1]);
                    if (compareRes) {
                        ExchangeArray(tdOrderValArr, j);
                        //交换行对象在数组中的顺序
                        ExchangeArray(trJqObjArr, j);
                        isExchanged = true;
                    }
                }
                //一遍比较过后如果没有进行交换则退出循环 
                if (!isExchanged)
                    break;
            }
            _initConfig.IsLazyMode && (_trJqObjArray_Obj[tdIndex] = trJqObjArr);
        }

        if (trJqObjArr) {
            if (options.Toggle) {
                _initConfig.IsLazyMode && isExist_trJqObjArr && trJqObjArr.reverse();
                options.Desc = !options.Desc;
            }
            ShowTable(trJqObjArr);
        }
    }

    /**
     * 显示排序后的表格
     * @private
     * @param trJqObjArr：排序后的tr对象数组
     **/
    function ShowTable(trJqObjArr) {
        for (var n = 0, len = trJqObjArr.length; n < len; n++) {
            _tbodyObj.append(trJqObjArr[n]);
            $.isFunction(_initConfig.OnShow) && (_initConfig.OnShow(n, trJqObjArr[n], _tbodyObj));
        }
    }

    /**
     * 交换数组中项的方法
     * @private
     * @param array：数组，j：交换数组项的尾项索引
     **/
    function ExchangeArray(array, j) {
        var temp = array[j];
        array[j] = array[j - 1];
        array[j - 1] = temp;
    }

    /**
     * 添加排序方式(规则)的方法
     * @private
     * @param tdVal：排序列的值，td_dataType：排序列的值类型
     **/
    function GetValue(tdVal, td_dataType) {
        switch (td_dataType) {
            case "int":
                return parseInt(tdVal) || 0;
            case "float":
                return parseFloat(tdVal) || 0;
            case "date":
                return Date.parse(tdVal) || 0;
            case "string":
            default:
                {
                    var tdVal = tdVal.toString() || "";
                    //如果值不为空，获得值是汉字的全拼
                    if (tdVal) {
                        tdVal = ZhCN_Pinyin.GetQP(tdVal);
                        tdVal = tdVal.toLowerCase();
                    }
                    return tdVal;
                }
        }
    }

    /**
     * 添加排序方式(规则)项的方法
     * @private
     * @param obj：排序触发(标签)的对象或id，index：要排序列所在的列索引，options：排序规则设置对象(如:DataType...)
     **/
    function SetOrderItem(obj, index, options) {
        var orderSettings = {
            ValAttr: false, //排序列的取值属性,默认为：innerText
            DataType: "string", //排序列的值类型(可取值：int|float|date|string)
            OnClick: null, //(点击)排序时触发的方法
            Desc: true, //(是否是降序)排序方式，默认为：降序
            Toggle: true, //切换排序方式
            DefaultOrder: false //是否是默认的排序方式
        };
        $.extend(orderSettings, options);
        orderSettings.DataType = orderSettings.DataType.toLowerCase();
        obj = GetJqObj(obj);
        //绑定触发排序的事件
        obj.bind("click", function() {
            Sort(index, orderSettings);
            if (orderSettings.Desc) obj.addClass('a-desc').removeClass('a-asc');
            else obj.addClass('a-asc').removeClass('a-desc');
            $.isFunction(orderSettings.OnClick) && orderSettings.OnClick();
        });
        orderSettings.DefaultOrder && Sort(index, orderSettings);
    }
    //#endregion

    //#region 对外公开
    var _api = {
        Init: function(obj, tBodyIndex, options) {
            /// <summary>初始化方法</summary>
            /// <param name="obj" type="Object">要排序table的id或对象</param>
            /// <param name="tBodyIndex" type="int">要排序的数据行所在的tbody标签的索引</param>
            /// <param name="options" type="Object">初始化配置对象,{IsLazyMode:是否是懒惰模式,OnShow: 排序后表格显示时的方法}</param>
            if (obj == null || typeof(obj) == undefined) {
                alert("TableOrder初始化参数为空或有误！");
                return;
            }
            if (typeof(ZhCN_Pinyin) == undefined) {
                alert("获得汉字首拼的'ZhCN_Pinyin'对象不存在！");
                return;
            }
            _tableObj = GetJqObj(obj);
            _tBodyIndex = tBodyIndex || 0;
            _tbodyObj = _tableObj.find("tbody:eq(" + _tBodyIndex + ")");
            options = options || {};
            _initConfig = {
                IsLazyMode: true, //是否是懒惰模式，默认为:true
                OnShow: null //排序后表格显示时的方法,params:trIndex,trJqObj,tbodyObj
            };
            $.extend(_initConfig, options);
            _trJqObjArray_Obj = null;
        },
        SetOrder: function(obj, index, options) {
            /// <summary>设置排序规则的方法</summary>
            /// <param name="obj" type="Object">排序触发(标签)的对象或id</param>
            /// <param name="index" type="int">要排序列所在的列索引</param>
            /// <param name="options" type="Object">排序规则设置对象(如:DataType...)</param>
            if (_tableObj == null) {
                alert("_tableObj尚未初始化！");
                return;
            }
            SetOrderItem(obj, index, options);
        }
    };
    window.TableOrderOper = _api;
    //#endregion
})();
