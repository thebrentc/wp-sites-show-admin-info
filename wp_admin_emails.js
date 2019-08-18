/* 
 * Poor person's admin email js lookup for wp network sites listing page
 * Paste code into developer tools console, then call lookupAdminEmails(); once screen loaded;
 */
function lookupAdminEmail(siteId, e) {
    jQuery.ajax({
        url: "https://network23.org/wp/wp-admin/network/site-settings.php",
        method: "GET",
        data: { id : siteId },
    })
      .done(function( html ) {
          // e.g. s/id="admin_email" value="someone@example.com"/
          var matches = html.match(/id="admin_email" value="([^"]*)"/);
          var adminEmail = matches[1];
          console.log(adminEmail);
          //return adminEmail;
          jQuery(e).append('<td class = "admin-email">'+adminEmail+'</td>');
    });
}

function lookupAdminEmails() {
    jQuery('table.wp-list-table thead tr').append('<th id = "admin-email">Admin email</th>');
    jQuery('table.wp-list-table tbody tr').each(function() {
        var siteId = jQuery(this).find('.object_id').first().text();
        console.log(siteId);
        lookupAdminEmail(siteId, this);         
    });
}

// lookupAdminEmails();
