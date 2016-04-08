var helpModel = {};

/**
 * 渲染并返回帮助（help）页面
 *
 * @param req
 * @param res
 */
helpModel.renderHelp = function (req, res) {
  res.render('help', {
    title: '帮助',
    curUser: {
      username: req.session.user.username,
      nickname: req.session.user.nickname,
      role: req.session.user.role
    },
    curPage: 'help'
  });
};


module.exports = helpModel;