var hoverCard = {
  'config': {
    'container': $('a[href*="user?id="]')
  },

  'init': function(config) {
    if (config && typeof(config) == 'object') {
      $.extend(hoverCard.config, config);
    }
    hoverCard.$container = hoverCard.config.container;
    hoverCard.$container.attr('data-url', chrome.extension.getURL('popup.html'));
    hoverCard.$container.tipsyHoverCard();
    hoverCard.$container.mouseover(function(){
      hoverCard.getUserProfile(this.text);
    })
  },

  'getUserProfile': function(user) {
    chrome.extension.sendRequest({user: user},  function(user) {
      var html = '<table>';
      html += '<tr><td>user:</td><td>' + user.username + '</td></tr>';
      html += '<tr><td>created:</td><td>' + user.createdAgo + '</td></tr>';
      html += '<tr><td>karma:</td><td>' + user.karma + '</td></tr>';
      if (user.about) {
        html += '<tr><td>about:</td><td>' + user.about + '</td></tr>';		
      }
      html += '<table>';
      $('div#hovercard').html(html);
    })
  }
}

hoverCard.init();