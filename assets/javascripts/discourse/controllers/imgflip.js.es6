import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  loading: true,
  selectedMeme: undefined,
  topText: "",
  bottomText: "",
  Fontxz:"",
  memes: [],

  actions: {
    pickItem: function(template_id) {
      this.set("selectedMeme", template_id);
    },
    apply: function() {
      var selectedMeme = this.get("selectedMeme"),
          topText = this.get("topText"), bottomText = this.get("bottomText"),Fontxz = this.get("Fontxz")
          self = this;
      Discourse.ajax(this.getUrl("caption_image") + "&template_id=" + selectedMeme +
        "&text0=" + topText + "&text1=" + bottomText + "&font=" + Fontxz).then(
          function(resp) {
            if (self.composerViewOld)
              self.composerViewOld.addMarkdown("![](" + resp.data.url + ")");
            else if (self.composerView)
              self.composerView._addText(self.composerView._getSelected(), "![](" + resp.data.url + ")");
          }.bind(this)
      );
      this.set("selectedMeme", undefined);
      this.send('closeModal');
    }
  },

  refresh: function() {
    this.set("loading", false);
  },

  onShow: function() {
    this.setProperties({"loading": true, "memes": [], topText: "", bottomText: "",Fontxz: "", selectedMeme: undefined });
    this.getMemes();
  },

  init: function () {
    this._super();
  },

  getMemes: function() {
    Discourse.ajax(this.getUrl("get_memes")).then(
        function(resp) {
          this.set("memes", resp.data.memes);
          this.refresh();
        }.bind(this)
    );
  },

  getUrl: function(path) {
    return this.siteSettings.imgflip_api_url + path + "?username=" + this.siteSettings.imgflip_api_username +
      "&password=" + this.siteSettings.imgflip_api_password;
  }
});
