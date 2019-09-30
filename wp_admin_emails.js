/* 
 * Poor person's admin email lookup for wp network sites listing page
 * Paste code into developer tools console, then call lookupSiteAdminEmails(); lookupAllSiteAdministratorEmails(); 
 * and optionally exportTableAsCSV(jQuery('table.wp-list-table'));
 * @author thebrentc@gmail.com 
 */
  
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

if (!String.prototype.replaceAll) { 
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);        
    };
} 
  
/* Lookup only main site admin email and add column */
function lookupSiteAdminEmail(siteId, e) {
    jQuery.ajax({
        url: "https://" + window.location.hostname + "/wp/wp-admin/network/site-settings.php",
        method: "GET",
        data: { id : siteId },
    })
      .done(function( html ) {
          // e.g. s/id="admin_email" value="someone@example.com"/
          var matches = html.match(/id="admin_email" value="([^"]*)"/);
          var adminEmail = matches[1];
          jQuery(e).append('<td class = "admin-email">'+adminEmail+'</td>');
    });
}

/* Lookup all main site admin email and add columns */
function lookupSiteAdminEmails() {
    jQuery('table.wp-list-table thead tr').append('<th id = "admin-email">Admin email</th>');
    jQuery('table.wp-list-table tbody tr').each(function() {
        var siteId = jQuery(this).find('.object_id').first().text();
        //console.log(siteId);
        lookupSiteAdminEmail(siteId, this);
    });
}

/* Lookup all administrator emails for site into column */
function lookupSiteAdministratorEmails(siteId, e) {
    jQuery.ajax({
        url: "https://" + window.location.hostname + "/wp/wp-admin/network/site-users.php",        
        method: "GET",
        data: { id : siteId, role: 'administrator' },
    })
      .done(function( html ) {
          var matches = html.matchAll(/<td.*data-colname="Email"><a[^>]*>(.*)<\/a>/g);
          var adminEmails = [];
          for (const match of matches) {
              adminEmails.push(match[1]);
          }          
          adminEmails_ = adminEmails.toString();
          adminEmails_ = adminEmails_.replaceAll(',',';');
          jQuery(e).append('<td class = "administrators">'+adminEmails.length+'</td>'); // add count
          jQuery(e).append('<td class = "administrator-emails">'+adminEmails_+'</td>');
    });
}

function lookupAllSiteAdministratorEmails() {
    jQuery('table.wp-list-table thead tr').append('<th id = "administrators">Administrators</th>');
    jQuery('table.wp-list-table thead tr').append('<th id = "administrator-emails">Administrator emails</th>');    
    jQuery('table.wp-list-table tbody tr').each(function() {
        var siteId = jQuery(this).find('.object_id').first().text();        
        lookupSiteAdministratorEmails(siteId, this);
    });
}

var csv;
function exportTableAsCSV(table /* e.g. jQuery('table.wp-list-table') */) {
    csv = '';
    jQuery(table).find('thead tr').first().find('th').each(function() { csv += '"'+jQuery(this).text() + '"' + ','; });
    csv = csv.substring(0,csv.lastIndexOf(",")) + "\n";
    jQuery(table).find('tbody tr').each(function() { 
        jQuery(this).find('td').each(function() {
            var val = jQuery(this).text();
            // some tidying
            val = val.replaceAll('Edit | Dashboard | Deactivate | Archive | Spam | Delete | VisitShow more details','');
            val = val.replace('||||||','');
            val = val.replace('\n','');
            val = val.trim();
            csv += '"' + val + '"' + ',';
        });
        csv = csv.substring(0,csv.lastIndexOf(",")) + "\n";        
    });
        
    console.log(csv);
}

// lookupSiteAdminEmails();
// lookupAllSiteAdministratorEmails();
// exportTableAsCSV(jQuery('table.wp-list-table'));
