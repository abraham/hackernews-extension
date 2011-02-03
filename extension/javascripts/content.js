var hoverCard = {
  config: {},
  $users: $('a[href*="user?id="]'),  
  friends: localStorage.getItem('friends') ? JSON.parse(localStorage.getItem('friends')) : [],

  profileTemplate: '<div>\
    <span>Created ${createdAgo} with ${karma}</span> \
    <p>{{html about}}</p> \
    <span><u><a href="submitted?id=${username}">submissions</a></u> <u><a href="threads?id=${username}">comments</a></u></span> \
    </div>',

  init: function (config) {
    console.log('hoverCard.init()');
    hoverCard.$users.live('click', function () {
      hoverCard.getUserProfile(this.text);
      return false;
    });
    
    addEventListener('unload', function () {
      localStorage.setItem('friends', JSON.stringify(hoverCard.friends));
    }, false);
  },

  getUserProfile: function (user) {
    console.log('hoverCard.getUserProfile()');
    chrome.extension.sendRequest({ user: user },  function (user) {
      $.tmpl(hoverCard.profileTemplate, user)
        .dialog({
          title: user.username,
          minWidth: 600,
          show: 'clip',
          modal: true,
          buttons: hoverCard.buttons(user.username)
        });
    })
  },
  
  buttons: function (username) {
    console.log('hoverCard.buttons()');
    var index = hoverCard.isFollowing(username),
        action = index === -1 ? 'Follow' : 'Unfollow';
    return [{
      text: action,
      click: function() {
        var index = hoverCard.isFollowing(username),
            action = index === -1 ? 'Follow' : 'Unfollow';
        if (action === 'Follow') {
          hoverCard.friends.push(username);
        } else {
          hoverCard.friends.splice(index, 1);
        }
        $(this).dialog('option', 'buttons', hoverCard.buttons(username))
      }
    }, {
      text: "Close",
      click: function() { $(this).dialog("close"); }
    }]
  },
  
  isFollowing: function (user) {
    console.log('hoverCard.isFollowing()');
    return hoverCard.friends.indexOf(user);
  }
}

hoverCard.init();