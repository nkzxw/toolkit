/**
 * convertface is a jQuery plugin that makes it easy to convert some face text to images (e.g 8) )
 *
 * @name convertface
 * @version 0.0.1
 * @requires jQuery v1.2.3+
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * https://github.com/itlessons/jquery-convertface
 * http://www.itlessons.info/javascript/facebook-or-icq-jquery-convertface-plugin/
 *
 * Copyright (c) 2013
 */
(function ($) {

    $.convertface = function (text) {
        return $.convertface.parse(text);
    };

    var $t = $.convertface;

    $.extend($.convertface, {

        settings: {
            replacement: '<img src="faces/{eId}.gif">',
            map: {
                "[呵呵]": "smile",
                "[嘻嘻]": "tooth",
                "[哈哈]": "laugh",
                "[爱你]": "love",
                "[晕]": "dizzy",
                "[泪]": "sad",
                "[馋嘴]": "cz",
                "[抓狂]": "crazy",
                "[哼]": "hate",
                "[抱抱]": "bb",
                "[可爱]": "tz",
                "[怒]": "angry",
                "[汗]": "sweat",
                "[困]": "sleepy",
                "[害羞]": "shame",
                "[睡觉]": "sleep",
                "[钱]": "money",
                "[偷笑]": "hei",
                "[酷]": "cool",
                "[衰]": "cry",
                "[吃惊]": "cj",
                "[闭嘴]": "bz",
                "[鄙视]": "bs2",
                "[挖鼻屎]": "kbs",
                "[花心]": "hs",
                "[鼓掌]": "gz",
                "[失望]": "sw",
                "[思考]": "sk",
                "[生病]": "sb",
                "[亲亲]": "qq",
                "[怒骂]": "nm",
                "[太开心]": "mb",
                "[懒得理你]": "ldln",
                "[右哼哼]": "yhh",
                "[左哼哼]": "zhh",
                "[嘘]": "x",
                "[委屈]": "wq",
                "[吐]": "t",
                "[可怜]": "kl",
                "[打哈气]": "k",
                "[顶]": "d",
                "[疑问]": "yw",
                "[做鬼脸]": "zgl",
                "[握手]": "ws",
                "[耶]": "ye",
                "[强]": "good",
                "[弱]": "sad_thumb",
                "[不要]": "no",
                "[ok]": "ok",
                "[赞]": "z2",
                "[来]": "come",
                "[蛋糕]": "cake",
                "[心]": "heart",
                "[伤心]": "unheart",
                "[钟]": "clock",
                "[猪头]": "pig",
                "[话筒]": "m",
                "[月亮]": "moon",
                "[太阳]": "sun",
                "[下雨]": "run"
            }
        },
        shortcode: function(eId){
            var $s = $t.settings;
            for (var pattern in $s.map) {
                if($s.map[pattern] == eId)
                    return pattern;
            }

            return "";
        },
        parse: function (text) {

            var $s = $t.settings;

            for (var pattern in $s.map) {

                var encPattent = $t.encode(pattern);

                if (text.indexOf(pattern) < 0 && text.indexOf(encPattent) < 0) {
                    continue;
                }

                var rep = $s.replacement
                    .replace(/\{eId\}/g, $s.map[pattern]);

                text = text
                    .replace(new RegExp($t.quote(pattern), "g"), rep)
                    .replace(new RegExp($t.quote(encPattent), "g"), rep);
            }

            return text;
        },
        encode: function (str) {
            return (str + '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        },
        quote: function (str) {
            return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }
    });

    $.fn.convertface = function (action, options) {
        this.each(function () {
            var el = $(this);
            el.html($.convertface(el.html()));
        });
    };
})(jQuery);