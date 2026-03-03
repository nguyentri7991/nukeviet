/**
 * NukeViet Content Management System
 * @version 5.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2025 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

'use strict';

$(function() {
    const informObject = $('#inform');

    const informSetStatus = (id, status, callback, btn) => {
        let url = informObject.data('page-url');
        url += ((-1 < url.indexOf("?")) ? '&' : '?') + 'nocache=' + new Date().getTime();
        let icon = null;
        if (btn) {
            icon = $('i', $(btn));
            if (icon.is('.fa-spinner')) return;
            if (!icon.data('icon')) {
                icon.data('icon', icon.attr('class'));
            }
            icon.removeClass(icon.data('icon')).addClass('fa-spinner fa-spin-pulse');
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                setStatus: status,
                id: id
            },
            dataType: 'json',
            success: function(result) {
                if ('OK' == result.status) {
                    if (typeof callback === "function") {
                        callback()
                    } else {
                        $('[name=filter]', informObject).trigger('change')
                    }
                } else if (icon) {
                    icon.removeClass('fa-spinner fa-spin-pulse').addClass(icon.data('icon'));
                }
            },
            error: function() {
                if (icon) {
                    icon.removeClass('fa-spinner fa-spin-pulse').addClass(icon.data('icon'));
                }
            }
        })
    };

    $('[name=filter]', informObject).on('change', function() {
        let url = informObject.data('page-url');
        const filter = $('[name=filter]', informObject).val();
        const query = (('' != filter && 'all' != filter) ? 'filter=' + filter + '&ajax=' : 'ajax=') + new Date().getTime();
        url += ((-1 < url.indexOf("?")) ? '&' : '?') + query;
        $.get(url, function(res) {
            $('.load_content', informObject).html(res)
        })
    });

    $('[name=filter]', informObject).trigger('change');

    informObject.on('click', '[data-toggle=informNotifySetStatus]', function(e) {
        e.preventDefault();
        const url = $(this).closest('.items').data('url');
        informSetStatus($(this).closest('.item').data('id'), $(this).data('status'), function() {
            $.get(url, function(res) {
                $('.load_content', informObject).html(res)
            })
        }, this)
    });

    informObject.on('click', '.message a', function(e) {
        const item = $(this).closest('.item');
        const href = $(this).attr('href');
        if (item.is('.viewed-0')) {
            e.preventDefault();
            informSetStatus(item.data('id'), 'viewed', function() {
                if ('' != href && '#' != href) {
                    window.location.href = href
                }
            }, null)
        }
    });

    informObject.on('click', '[data-toggle=more]', function(e) {
        e.preventDefault();
        const obj = $(this).closest('.item');
        $('.more', obj).hide();
        $('.morecontent', obj).show()
    });
});
