var minX = null;
var maxX = null;
var minY = null;
var maxY = null;
var discounts = false;
var clonePirce = 0;
var isActivityTemplate, theTemplatePirce;
var scaleSize = 1;
var isTemplate = Util.getUrlParams("template") == "true";
Designer.events.addEventListener("initialized", function () {
  var b = $("#view_container");
  var a = 410;
  var d = 50;
  if (typeof embed != "undefined") {
    b = $("body");
    a = 0;
    d = 0;
  }
  if (document.getElementById("support_canvas").getContext) {
    c(function (m) {
      $(".title").text(m.title);
      if (m.page.backgroundColor) {
        $("#view_container").css(
          "background-color",
          "rgb(" + m.page.backgroundColor + ")"
        );
      }
      Designer.open(m);
      Designer.hotkey.cancel();
      Designer.op.cancel();
      Designer.contextMenu.destroy();
      var f = $("#designer_canvas");
      f.children(".shape_box").each(function () {
        var p = $(this);
        var q = p.position();
        var o = q.left + p.width();
        var n = q.top + p.height();
        if (minX == null || q.left < minX) {
          minX = q.left;
        }
        if (maxX == null || o > maxX) {
          maxX = o;
        }
        if (minY == null || q.top < minY) {
          minY = q.top;
        }
        if (maxY == null || n > maxY) {
          maxY = n;
        }
      });
      var e = maxX - minX;
      var h = maxY - minY;
      var k = b.width() - a;
      var i = b.height();
      var g = k / e;
      if (typeof embed != "undefined") {
        scaleSize = Math.floor(g * 10) / 10;
      } else {
        if (g < 0.7) {
          g = 0.7;
        } else {
          if (g > 1.2) {
            g = 1.2;
          } else {
            g = g.toFixed(1);
          }
        }
        var l = i / h;
        if (l < 0.7) {
          l = 0.7;
        } else {
          if (l > 1.2) {
            l = 1.2;
          } else {
            l = l.toFixed(1);
          }
        }
        if (g > l) {
          scaleSize = l;
        } else {
          scaleSize = g;
        }
      }
      zoom = parseFloat(scaleSize);
      Designer.setZoomScale(zoom);
      $(".embed_resize")
        .children("label")
        .text(parseInt(zoom * 100) + "%");
      minX = null;
      maxX = null;
      minY = null;
      maxY = null;
      f.children(".shape_box").each(function () {
        var p = $(this);
        var q = p.position();
        var o = q.left + p.width();
        var n = q.top + p.height();
        if (minX == null || q.left < minX) {
          minX = q.left;
        }
        if (maxX == null || o > maxX) {
          maxX = o;
        }
        if (minY == null || q.top < minY) {
          minY = q.top;
        }
        if (maxY == null || n > maxY) {
          maxY = n;
        }
      });
      var e = maxX - minX;
      if (e < b.width()) {
        f.css("left", (b.width() - maxX - minX) / 2);
      } else {
        f.css("left", -minX + d);
      }
      var h = maxY - minY;
      if (h < b.height()) {
        f.css("top", (b.height() - maxY - minY) / 2);
      } else {
        f.css("top", -minY + d);
      }
    });
  }
  function c(e) {
    var f = window.location.href.indexOf("fromnew") > -1;
    $.get(
      "/diagraming/getdef?tempId=" + tempId,
      {
        id: chartId,
        template: f,
      },
      function (h) {
        if (h.error == "reptile") {
          console.error("请求过于频繁、请稍后重试");
          var g = new TencentCaptcha("2046103261", function (i) {
            if (i.ret === 0) {
              setTimeout(function () {
                c(e);
              }, 1000);
            }
          });
          g.show();
          return;
        } else {
          e(JSON.parse(h.def));
        }
      }
    );
  }
});
$(function () {
  if (isTemplate) {
    $("[tem_if=notTemplate]").hide();
    $("[tem_key=height]").css({
      height: "100%",
    });
  } else {
    $("[tem_if=notTemplate]").show();
  }
  getActivityList();
  initChartOperate();
  initCommentPost();
  if (!document.getElementById("support_canvas").getContext) {
    $("#designer_canvas")
      .empty()
      .append("<img src='/chart_image/id/" + chartId + ".png'/>");
  }
  warnUserClone();
});
function initChartOperate() {
  h();
  $(window).on("resize.view", function () {
    h();
  });
  var a = $("#view_container");
  function h() {
    var k = $(window).height();
    if (typeof embed != "undefined") {
      var i = $("#view_container").siblings("div:visible").height();
      if (isTemplate) {
        i = 0;
      }
      $("#view_container").height(k - i);
    } else {
      var i = 53;
      if (isTemplate) {
        i = 0;
      }
      $("#view_container").height(k - i);
    }
  }
  $(".mind-view-left").css({
    width: $(".mind-view-left").innerWidth(),
    left: 0,
  });
  $(".temp .info-temp")
    .off()
    .on("click", ".temp-list-item", function () {
      var i = $(this).attr("chartId");
      var k = "/view/" + i + "?fromnew=1";
      if (cteamId != null && cteamId != "") {
        k += "&cteamId=" + cteamId;
      }
      if (corgId != null && corgId != "") {
        k += "&corgId=" + corgId;
      }
      if ($(this).parent().hasClass("works-content")) {
        poCollect("详情-点击", {
          名称: "详情-点击用户其他作品",
        });
        window.location.href = k;
      } else {
        poCollect("详情-点击", {
          名称: "详情-点击猜你喜欢",
        });
        window.open(k);
      }
    });
  $(".item[share]").on("click", function (l) {
    l.stopPropagation();
    var i = $(".pop-con.share"),
      k = $(this);
    if (i.css("opacity") == 1) {
      i.css({
        opacity: 0,
        right: -446,
      });
      k.removeClass("active");
    } else {
      i.css({
        opacity: 1,
        display: "block",
        right: "2px",
      });
      k.addClass("active");
    }
    zhuge.track("点击分享到社交网络", {
      触发位置: "文件预览",
    });
  });
  $("body").on("click", function () {
    var i = $(".pop-con");
    i.css({
      opacity: 0,
      display: "none",
      right: -446,
    });
    $(".item[share]").removeClass("active");
    $(".weixin-con").css("display", "none");
  });
  $(".pop-con").on("click", function (i) {
    i.stopPropagation();
  });
  $(".con-close").on("click", function () {
    var i = $(".pop-con");
    i.css({
      opacity: 0,
      display: "none",
      right: -446,
    });
    $(".item[share]").removeClass("active");
  });
  $(".viewtitle .down").on("click", function () {
    var i = $(this);
    if ($(".chart-des").is(":visible")) {
      $(".chart-des").hide();
      i.html("&#xe617;");
      $(".chart-pubtime").hide();
    } else {
      i.html("&#xe68d;");
      $(".chart-des").show();
      $(".chart-pubtime").show();
    }
  });
  $("#userlike").on("click", function () {
    if (uc) {
      doLikeChart();
    } else {
      Util.loginWindow("open", function () {
        location.reload();
      });
    }
  });
  $("#userfav").on("click", function () {
    if (uc) {
      doFavourite();
    } else {
      Util.loginWindow("open", function () {
        location.reload();
      });
    }
  });
  $("input[name=report-category]").change(function () {
    if ($(this).parent().text() == "其他理由") {
      $("#report_content").val("").show();
    } else {
      $("#report_content").val("").hide();
    }
  });
  $("#userReport").on("click", function () {
    $("#report-page").dialog();
    $("#btn_submit_report")
      .enable()
      .off()
      .on("click", function () {
        var k = $("#report_content").val();
        var i = $("[name=report-category]:checked").parent().text();
        if (i == "模板内容涉及侵权") {
          i = i + $(".tort option:selected").text();
        } else {
          if (i == "其他理由") {
            if (!k) {
              Util.globalTopTip(
                "举报信息不能为空",
                "top_error",
                3000,
                $("#report-page"),
                true
              );
              return;
            } else {
              if (k.length > 200) {
                Util.globalTopTip(
                  "举报信息不能超过200个字符",
                  "top_error",
                  3000,
                  $("#report-page"),
                  true
                );
                return;
              }
            }
          }
        }
        $(this).disable();
        Util.ajax({
          url: "/view/report",
          data: {
            chartId: chartId,
            content: k,
            category: i,
          },
          success: function (l) {
            Util.globalTopTip(
              "您的举报信息已提交",
              null,
              3000,
              $("#report-page"),
              true
            );
            setTimeout(function () {
              $("#report-page").dialog("close");
            }, 3000);
          },
        });
      });
  });
  $(".controlls,.info-temp,.view-nav").on("mousedown", function (i) {
    i.stopPropagation();
  });
  $(".satus-follow").on("click", function () {
    if ($(this).hasClass("followed")) {
      follow.unFollow($(this), ownerId);
    } else {
      poCollect("详情-点击", {
        名称: "详情-关注",
      });
      follow.saveFollow($(this), ownerId);
    }
  });
  $("#view_container").on("touchstart", function (l) {
    var o = l.originalEvent.changedTouches[0];
    var n = o.pageX;
    var i = o.pageY;
    $("#view_container").css("cursor", "move");
    var m = $("#canvas").position().left / zoom;
    var k = $("#canvas").position().top / zoom;
    $("#view_container").on("touchmove", function (r) {
      var q = r.originalEvent.changedTouches[0];
      var p = q.pageX - n;
      var s = q.pageY - i;
      r.preventDefault();
      $("#canvas").css({
        left: m + p / zoom + "px",
        top: k + s / zoom + "px",
      });
    });
    $("#view_container").on("touchend", function (p) {
      $("#view_container").off("touchmove");
      $("#view_container").off("touchend");
      $("#view_container").css("cursor", "default");
    });
  });
  var c = $("#viewport").parent()[0];
  var f =
    c.requestFullScreen ||
    c.webkitRequestFullScreen ||
    c.mozRequestFullScreen ||
    c.msRequestFullScreen;
  var b =
    document.cancelFullScreen ||
    document.webkitCancelFullScreen ||
    document.mozCancelFullScreen ||
    document.exitFullScreen;
  if (f) {
    $("#viewport")
      .parent()
      .unbind("webkitfullscreenchange")
      .bind("webkitfullscreenchange", function (i) {
        toogleFullDocument();
      });
    $(document)
      .unbind("mozfullscreenchange")
      .unbind("fullscreenchange")
      .bind("mozfullscreenchange", function (i) {
        toogleFullDocument();
      })
      .bind("fullscreenchange", function (i) {
        toogleFullDocument();
      });
    $("#op_fullscreen").bind("click", function (i) {
      f.call(c);
    });
    $("#op_exitFullscreen").bind("click", function (i) {
      b.call(document);
    });
    $(window).bind("keydown", function (i) {
      if (i.keyCode == 122) {
        f.call(c);
        i.preventDefault();
      }
    });
  } else {
    $("#op_fullscreen").bind("click", function (i) {
      hintTip("当前浏览器不支持全屏操作，请使用其他浏览器尝试", 2000);
      return;
    });
    $(window).bind("keydown", function (i) {
      if (i.keyCode == 122) {
        return;
      }
    });
  }
  $("#op_zoomin").bind("click", function () {
    zoomin();
  });
  $("#op_zoomout").bind("click", function () {
    zoomout();
  });
  $(".copyurl").on("click", function () {
    $("body").append(
      '<input type="text" value="' +
        location.href +
        '" class="cururl" style="position: fixed;left:-20000px;z-index:-999">'
    );
    if (!$(".cururl").val().trim()) {
      return;
    }
    $(".cururl").select();
    try {
      if (document.execCommand("copy", false, null)) {
        $(".pop-con.share").append('<div class="cururl">复制成功</div>');
        setTimeout(function () {
          $(".cururl").remove();
        }, 3000);
      } else {
      }
    } catch (i) {}
  });
  $("#view_container").on("mousewheel DOMMouseScroll", function (k) {
    var i = k.originalEvent.wheelDelta || -k.originalEvent.detail;
    var l = Math.max(-1, Math.min(1, i));
    if (k.ctrlKey || k.metaKey) {
      k.preventDefault();
      if (l < 0) {
        Designer.zoomOut();
      } else {
        Designer.zoomIn();
      }
    }
  });
  $("#view_container").bind("dragstart", function () {
    return false;
  });
  $("#view_container").css(
    "backgroundColor",
    $("#designer_canvas").css("backgroundColor")
  );
  $("#view_container").mousedown(function (k) {
    var n = k.pageX;
    var i = k.pageY - $("#view_container").scrollTop();
    $("#view_container").css("cursor", "move");
    var m = $("#designer_canvas").position().left;
    var l = $("#designer_canvas").position().top;
    $(document).bind("mousemove.drag", function (p) {
      var o = p.pageX - n;
      var q = p.pageY - i;
      $("#designer_canvas").css({
        left: m + o + "px",
        top: l + q + "px",
      });
    });
    $(document).mouseup(function (o) {
      $(document).unbind("mousemove.drag");
      $(document).unbind("mouseup");
      $("#view_container").css("cursor", "default");
    });
  });
  var g = true;
  var e = false;
  var d = false;
  $(".item[comment]")
    .off()
    .on("click", function () {
      if (g == false) {
        return;
      }
      if (
        !$(this).hasClass("active") &&
        $(".pop-con.share").css("opacity") == 1
      ) {
        $(".share .con-close").trigger("click");
      }
      if (!$(this).hasClass("active") && $(".item[info]").hasClass("active")) {
        $(".item[info]").trigger("click");
        localStorage.setItem("infoState", "close");
      }
      sliding("controlls");
      g = false;
      if (!d) {
        loadComments();
      }
      d = true;
      setTimeout(function () {
        g = true;
      }, 500);
    });
  $(".item[info]")
    .off()
    .on("click", function () {
      if (g == false) {
        return;
      }
      if (
        !$(this).hasClass("active") &&
        $(".pop-con.share").css("opacity") == 1
      ) {
        $(".share .con-close").trigger("click");
      }
      if (
        !$(this).hasClass("active") &&
        $(".item[comment]").hasClass("active")
      ) {
        $(".item[comment]").trigger("click");
      }
      sliding("infoTemp");
      g = false;
      if (!e) {
        templates();
      }
      e = true;
      setTimeout(function () {
        g = true;
      }, 500);
      var i = $(this).hasClass("active");
      setTimeout(function () {
        var m = $("#view_container");
        var n = $("#designer_canvas");
        var k = i ? 100 : 0;
        var o = maxY - minY;
        var l = maxX - minX;
        if (l < m.width() - k) {
          n.css("left", (m.width() - k - maxX - minX) / 2);
        } else {
          n.css("left", -minX + 50);
        }
      }, 100);
    });
  if (
    !localStorage.getItem("infoState") ||
    localStorage.getItem("infoState") == "open"
  ) {
    setTimeout(function () {
      $(".item[info]").trigger("click");
    }, 800);
  }
  $(".info-temp .item-close").on("click", function () {
    $(".item[info]").trigger("click");
  });
  $(".controlls .item-close").on("click", function () {
    $(".item[comment]").trigger("click");
  });
  window.onresize = function () {
    if ($(".item[info]").hasClass("active")) {
      $(".mind-view-left").css("width", $("body").innerWidth() - 410);
    } else {
      if ($(".item[comment]").hasClass("active")) {
        $(".mind-view-left").css("width", $("body").innerWidth() - 410);
      } else {
        $(".mind-view-left").css("width", "100%");
      }
    }
  };
  $("#comment").on("input", function () {
    if ($(this).html() == "") {
      $(this).html("<br/>");
    }
  });
  $(".mind-view-left,.textarea").on("click", function () {
    replyHide();
  });
}
function replyHide() {
  $(".reply_box_ref").slideUp(200, function () {
    $(".reply_box_ref").remove();
  });
}
function zoomin() {
  zoom += 0.1;
  Designer.setZoomScale(zoom);
}
function zoomout() {
  if (zoom <= 0.4) {
    return;
  }
  zoom -= 0.1;
  Designer.setZoomScale(zoom);
}
var comArr = [];
function sliding(a) {
  if (comArr.indexOf(a) == -1) {
    comArr.push(a);
  } else {
    comArr.remove(a);
  }
  controllsTagger(a);
  dable = false;
}
function controllsTagger(b) {
  var a = $("body").innerWidth();
  if (b == "controlls") {
    if (comArr.indexOf("controlls") != -1) {
      $(".item[comment]").addClass("active");
      $(".mind-view-left").css("width", a - 410);
      $(".controlls").css("right", 0);
    } else {
      $(".item[comment]").removeClass("active");
      $(".mind-view-left").css("width", a);
      $(".controlls").css("right", -410);
    }
    $(".outline-dlg").css("width", "100%");
  }
  if (b == "infoTemp") {
    if (comArr.indexOf("infoTemp") != -1) {
      poCollect("详情-点击", {
        名称: "详情-打开",
      });
      $(".item[info]").addClass("active");
      $(".info-temp").css("right", 0);
      $(".mind-view-left").css({
        width: a - 410,
      });
      localStorage.setItem("infoState", "open");
    } else {
      poCollect("详情-点击", {
        名称: "详情-关闭",
      });
      $(".item[info]").removeClass("active");
      $(".info-temp").css("right", -410);
      $(".mind-view-left,.outline-dlg").css({
        width: a,
      });
      localStorage.setItem("infoState", "close");
    }
    $(".outline-dlg").css("width", "100%");
  }
  setTimeout(function () {
    $("#movecenter").trigger("click");
  }, 300);
}
var showTiping = null;
function hintTip(c, a, e, d) {
  var b = $("#mind-tip");
  if (c == "close") {
    b.remove();
    return;
  }
  if (b.length == 0) {
    b = $(
      "<div id='mind-tip'><div class='mind-tip-text'></div></div>"
    ).appendTo("body");
    b.append("<div class='mind-tip-close mind-icons'></div>");
    b.children(".mind-tip-close").on("click", function () {
      hintTip("close");
    });
  }
  if (d) {
    b.children(".mind-tip-close").on("click.callback", function () {
      d();
    });
  } else {
    b.children(".mind-tip-close").unbind("click.callback");
  }
  b.children(".mind-tip-text").html(c);
  b.css({
    marginLeft: -b.width() / 2 - 30,
  });
  if (e != null && e == "left_bottom") {
    b.show().css({
      bottom: 100,
      left: 25,
      marginLeft: "0",
      top: "initial",
    });
  } else {
    b.show().css({
      top: 60,
    });
  }
  if (a != null && showTiping == null) {
    showTiping = setTimeout(function () {
      hintTip("close");
      showTiping = null;
    }, a);
  }
}
function templates() {
  $(".info-temp .chart-img").click(function () {
    poCollect("详情-点击", {
      名称: "详情-点击头像",
    });
  });
  $.ajax({
    url: "/templates/author_templates",
    data: {
      page: 1,
      pageSize: 5,
      ownerId: ownerId,
    },
    success: function (b) {
      var a = b.rows;
      if (a && a.length > 0) {
        renderWorks(a);
      } else {
        $(".other-works").remove();
      }
    },
  });
  $.ajax({
    url: "/templates/" + chartId + "/associated_templates",
    data: {
      page: 1,
      pageSize: 6,
    },
    success: function (b) {
      var a = b.rows;
      if (a && a.length > 0) {
        if (
          (a[0].specialIds &&
            a[0].specialIds.length > 0 &&
            a[0].publicClonePrice > 0) ||
          (a[0].tags && a[0].tags.indexOf("暑期生活") > -1)
        ) {
          isActivityTemplate = true;
        }
        theTemplatePirce = a[0].publicClonePrice;
        renderTemp(a);
      } else {
        $(".related-temp").remove();
      }
    },
  });
}
var zoom = 1;
function increaseZoomScale(h) {
  if (zoom <= 0.4) {
    return;
  }
  var b = $("#view_container");
  var c = $("#designer_canvas");
  var a = {
    x: b.width() / 2,
    y: b.height() / 2,
  };
  var g = a.x - c.position().left;
  var e = a.y - c.position().top;
  var f = g * (1 + h);
  var d = e * (1 + h);
  c.css({
    left: a.x - f,
    top: a.y - d,
  });
  zoom += h;
  Designer.setZoomScale(zoom);
}
var isFullScreen = false;
function toogleFullDocument(b) {
  isFullScreen = !isFullScreen;
  if (isFullScreen) {
    fullDocument();
  } else {
    exitFullDocument();
  }
  var a = $("#op_fullscreen").parent();
  var c = $("#op_exitFullscreen").parent();
  if (isFullScreen) {
    if (typeof b != "undefined") {
      a.show();
      c.hide();
    } else {
      a.hide();
      c.show();
    }
  } else {
    a.show();
    c.hide();
  }
}
function fullDocument() {
  $("#view_container").addClass("full_document");
  $("#view_container").css({
    height: "100vh",
  });
  $("body").addClass("overhidden");
  $(".ico_fullscreen").addClass("exit");
}
function exitFullDocument() {
  var a = 53;
  if (isTemplate) {
    a = 0;
  }
  $("#view_container").removeClass("full_document");
  $("#view_container").css({
    height: $(window).height() - a,
  });
  $("body").removeClass("overhidden");
  $(".ico_fullscreen").removeClass("exit");
}
var chartCloning = false;
function newCreateConfirm(d, c, a, b) {
  if (chartCloning) {
    return;
  }
  if (d == chartId) {
    sessionStorage.setItem("showCoupon", $("#cloneBtn").attr("data-discounts"));
    sessionStorage.setItem("thePirce", $("#clonePirce").text());
    poCollect("详情-点击", {
      名称: "详情-模板克隆",
    });
  }
  c = c ? c : cteamId;
  a = a ? a : corgId;
  chartCloning = true;
  Util.loadingball({});
  Util.ajax({
    url: "/diagraming/clone_check",
    data: {
      chartId: d,
      teamId: c,
      orgId: a,
    },
    success: function (f) {
      Util.loadingball({
        close: true,
      });
      if (f.result == "clone") {
        poCollect("模版-克隆成功");
        location =
          "/diagraming/new?template=" +
          d +
          (c && c != "null" ? "&team=" + c : "") +
          (a && a != "null" ? "&org=" + a : "");
        return;
      }
      chartCloning = false;
      if (f.result == "cloneBuy") {
        poCollect("点击触发-支付弹窗", {
          渠道来源: b ? "猜你喜欢" : "预览页",
        });
        Util.payWindow(
          "open",
          {
            chartId: d,
            price: f.price,
          },
          function () {}
        );
        return;
      }
      if (f.result == "overd") {
        Util.globalTopTip(
          "您的文件数量不足，无法克隆,您可以去 <a href='/upgrade' target='_blank'>升级账号</a>",
          "top_error",
          5000
        );
        return;
      } else {
        if (f.result == "chart_error") {
          Util.globalTopTip(
            "很抱歉，该模板已被作者取消公开或删除。请继续浏览并使用其他模板～",
            "top_error",
            5000
          );
          return;
        }
      }
      Util.globalTopTip("操作有误，请稍后再试", "top_error", 5000);
    },
  });
}
function initCommentPost() {
  var a = $("#btn-comment");
  a.disable();
  $("#comment").bind("keyup", function (c) {
    var b = $("#comment").clone();
    if (validInput(b)) {
      a.enable();
      $(this).removeClass("empty");
    } else {
      a.disable();
      $(this).addClass("empty");
    }
  });
  $("#comment")
    .bind("keydown", function (b) {
      if (b.ctrlKey && b.keyCode == 13) {
        submitComment();
      }
    })
    .streamInput({
      face: $("#showFaces"),
    });
  a.off().on("click", function (b) {
    if ($(this).attr("disabled")) {
      return;
    }
    submitComment();
    b.stopPropagation();
  });
}
function validInput(a) {
  var b = a
    .html()
    .replace(/<img(\s|\S)+?src=\"/g, ":lt: class=ico-face src=")
    .replace(/\">/g, ":gt:")
    .trim();
  b = Util.filterXss(b);
  if (b == "&lt;br&gt;" || b == "") {
    return false;
  } else {
    return true;
  }
}
function submitComment(d, c, f, e) {
  var a = $("#comment").clone();
  if (d != null) {
    a = d;
  }
  var b = a
    .html()
    .replace(/<img(\s|\S)+?src=\"/g, ":lt: class=ico-face src=")
    .replace(/\">/g, ":gt:")
    .trim();
  b = Util.filterXss(b);
  if (b == "&lt;br&gt;" || b == "") {
    return;
  } else {
    if (d != null) {
      a.parent().find(".button").disable();
    } else {
      $("#btn-comment").disable();
    }
    $("#btn-comment").attr("disabled", "disabled");
    Util.ajax({
      url: "/view/submitcomment",
      data: {
        chartId: chartId,
        content: b,
        ownerId: ownerId,
        refId: c,
        parentId: f,
      },
      success: function (i) {
        if (i.result == "error_text") {
          Util.globalTopTip(
            "描述或标签中存在敏感词汇，请修改后再发布",
            "top_error",
            3000,
            $(".controlls"),
            true
          );
          return;
        }
        poCollect("模版详情页-评论", {
          名称: "评论-发表",
        });
        var g = $("#comment_count"),
          h = parseInt(g.text()) + 1;
        g.text(h);
        $("#comment-count").text(numberHandle(h));
        if (f) {
          var k = $(".reply_list li[data-id=" + f + "]");
          k.find(".replies").append(i);
        } else {
          $(".reply_list").append(i);
          $(".repler-right").scrollTop(9999);
        }
        $("#btn-comment").removeAttr("disabled");
        $("#comment").html("<br/>").addClass("empty");
        checkCommentCount();
        a.remove();
        if (e != null) {
          e();
        }
      },
    });
  }
}
function commentRef(c, b, f) {
  var e = $(c).parent().next(".reply_box_ref");
  $(".reply_box_ref").not(e).remove();
  if (e.length == 0) {
    e = $(
      "<div class='reply_box_ref'><div class='txt text-input empty' contentEditable='true' spellcheck='false' id='reply-input' accesskey='q' style='padding:6px 5px'></div><div class='reply-bottom'><span id='showfaces-reply' class='icons'>&#xe70e;</span><div><span class='cancel'>取消</span><span class='button'>发表</span></div></div></div>"
    );
    $(c).parent().after(e);
    $(c).parent().next(".reply_box_ref").attr({
      id: b,
      pId: f,
    });
    function d() {
      var g = e.children(".txt");
      submitComment(g, b, f, function () {
        e.remove();
      });
    }
    e.children(".txt")
      .bind("keydown", function (g) {
        if (g.ctrlKey && g.keyCode == 13) {
          submitComment();
        }
      })
      .streamInput({
        face: $("#showfaces-reply"),
      });
    var a = e.find(".button");
    a.disable();
    $("#reply-input").bind("keyup", function (h) {
      var g = $("#reply-input").clone();
      if (validInput(g)) {
        a.enable();
        $(this).removeClass("empty");
      } else {
        a.disable();
        $(this).addClass("empty");
      }
    });
    a.off().on("click", function () {
      d();
    });
  }
  e.find(".cancel").click(function () {
    e.slideUp(200, function () {
      $(".reply_box_ref").remove();
    });
  });
  if (e.is(":visible")) {
    e.slideUp(200, function () {
      $(".reply_box_ref").remove();
    });
  } else {
    e.slideDown(200);
    e.find(".txt").focus();
  }
}
function openDeldia(c, a, b) {
  $.confirm({
    content: "确认删除此条评论吗？",
    onConfirm: function () {
      $(b).disable();
      Util.get(
        "/view/delComments",
        {
          refId: a,
          chartId: chartId,
          parentId: c,
        },
        function (f) {
          var d = "";
          if ($(b).parents("div").hasClass("reply_list-item")) {
            d = 1;
            $(b).parents(".reply_list-item").remove();
          } else {
            d =
              $(b).parents("li").find("li").length +
              $(b).parents("li").find(".reply_list-item").length +
              1;
            $(b).parents("li").remove();
          }
          var g = $("#comment_count"),
            e = Number(g.text()) - d;
          g.text(e);
          $("#comment-count").text(numberHandle(e));
          checkCommentCount();
        }
      );
    },
  });
}
function showFaces(c, b) {
  var a = $("#faces_dialog"),
    d = b || $("#comment");
  if (a.length > 0) {
    a.popMenu({
      target: c,
      position: "right",
      zindex: 19,
    });
    return;
  }
  var a = $(
    '<div id="faces_dialog" class="faces-lib"><ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><div class="clear"></div></ul></div>'
  );
  a.appendTo("body");
  a.popMenu({
    target: c,
    position: "right",
  });
  a.find("li").on("mousedown", function (h) {
    var g = $(this).index();
    var f =
      "<img class='ico-face' src='/assets/images/faces/faces/" +
      (g + 1) +
      ".gif' />";
    d.append(f);
    a.popMenu("close");
    h.stopPropagation();
  });
}
var currentSkip = -15;
function loadComments() {
  currentSkip += 15;
  Util.ajax({
    url: "/view/loadcomments",
    data: {
      chartId: chartId,
      skip: currentSkip,
      ownerId: ownerId,
    },
    success: function (c) {
      $(".reply_list").append(c);
      var e = $(".item[comment] .item-count").text();
      var b = $(".reply_list").find("li").length + $(".reply_list-item").length;
      if (currentSkip >= 15) {
        var a = $(".repler-right").scrollTop();
        var d = setInterval(function () {
          a += 150;
          if (
            a >=
            $(".repler-right").scrollTop() + $(".repler-right").innerHeight()
          ) {
            clearInterval(d);
          }
          $(".repler-right").scrollTop(a);
        }, 40);
      }
      if (b >= 15) {
        $(".load_more").show();
      }
      if ($.trim(c) == "" || e == b) {
        $(".load_more").hide();
      }
      checkCommentCount();
    },
  });
}
function checkCommentCount() {
  var b = $(".reply_list");
  if ($.trim(b.text()) == "") {
    var a =
      "<div class='empty-tip'><div class='empty-img' style='margin-bottom:20px;'><img src='/assets/images/empty.png'></img></div><span class='tip-text'>评论区还是空的</span><span id='none-tip' style='display:block;color:#ADADAD;margin-top:10px;'>快来抢占沙发吧~</span></div>";
    b.html(a);
  } else {
    $(".empty-tip").remove();
  }
}
function doFavourite() {
  var a = $("#userfav");
  a.disable();
  if (a.hasClass("active")) {
    a.find(".icons").removeClass("userFavAni");
    a.numberTip({
      val: "-1",
    });
  } else {
    poCollect("详情-点击", {
      名称: "详情-模板收藏",
    });
    a.find(".icons").addClass("userFavAni");
    a.numberTip();
  }
  Util.ajax({
    url: "/view/favouriteChart",
    data: {
      chartId: chartId,
    },
    success: function (d) {
      a.enable();
      var e = a.find(".item-count"),
        c = Number(e.text());
      if (d.result == "save") {
        if (c < 1000) {
          e.text(c + 1);
        }
        a.attr("class", "item active");
        $(a).find(".ico_box .icons").html("&#xe7e0;");
      } else {
        if (c < 1000) {
          var b = c - 1;
          e.text(b < 0 ? 0 : b);
        }
        a.attr("class", "item");
        $(a).find(".ico_box .icons").html("&#xe7dc;");
      }
    },
  });
}
function doLikeChart() {
  var b = $("#userlike");
  b.disable();
  if (b.hasClass("active")) {
    b.numberTip({
      val: "-1",
    });
  } else {
    poCollect("详情-点击", {
      名称: "详情-模板点赞",
    });
    b.numberTip();
    b.find(".ico_box").css({
      "vertical-align": "middle",
      "margin-top": "-4px",
      width: "16px",
    });
    $("#like-count").css({
      "vertical-align": "middle",
      "margin-top": "2px",
    });
    b.find(".icons").hide();
    var a = lottie.loadAnimation({
      container: document.getElementById("userlike").querySelector(".ico_box"),
      renderer: "svg",
      loop: false,
      autoplay: true,
      setSpeed: 0.5,
      path: "/assets/images/new/lottie.json",
    });
  }
  Util.ajax({
    url: "/view/dolike",
    data: {
      chartId: chartId,
    },
    success: function (c) {
      b.enable();
      if (c.result) {
        b.attr("class", "item active");
        $(b).find(".ico_box .icons").html("&#xe6d5;");
      } else {
        b.find(".ico_box").html('<span class="icons">&#xe7db;</span>').css({
          "vertical-align": "unset",
          "margin-top": "0",
        });
        $("#like-count").css({
          "vertical-align": "unset",
          "margin-top": "0",
        });
        b.attr("class", "item");
        $(b).find(".ico_box .icons").html("&#xe6d1;");
      }
      b.find(".item-count").text(numberHandle(c.count));
    },
  });
}
function showWeixin(g) {
  var f = $(g).offset().left;
  var e = $(g).offset().top;
  var c = window.location.href;
  var a = $("#pageurl_div");
  if (a.length > 0) {
    a.show();
    return;
  }
  var d = $(
    '<div id="pageurl_div" class="weixin-con"><img id="pageurl" src=""/><div>微信扫一扫 分享</div></div>'
  );
  d.appendTo("body");
  var b =
    "https://api.qrserver.com/v1/create-qr-code/?data=" +
    c +
    "&show_wechat_share_tip=true&size=180x180";
  $("#pageurl").attr("src", b);
  $("#pageurl_div")
    .css({
      right: "220px",
      top: "60px",
    })
    .show();
  $(document).on("mousedown", function () {
    $("#pageurl_div").hide();
  });
}
function warnUserClone() {
  var b = Util.getUrlParams("fromnew");
  if (!b == 0) {
    var c = $(".item-clone-opt"),
      a = c.length;
    if (a > 0) {
      $(".new-clone-tip").fadeIn();
      window.setTimeout(function () {
        $(".new-clone-tip").fadeOut();
      }, 5000);
    }
  } else {
    $(".new-clone-tip").hide();
  }
}
function renderWorks(d) {
  var c = "",
    a = 0;
  for (var b = 0; b < d.length; b++) {
    if (d[b].chartId != chartId && a < 5) {
      c +=
        '<li class="temp-list-item" chartid="' +
        d[b].chartId +
        '"><div class="name">' +
        d[b].title +
        '</div><div class="social-btn-group"><span style="margin-right:16px;">' +
        (d[b].publishTime ? d[b].publishTime.slice(0, 10) : "") +
        '</span><span class="praise social-btn"><span class="icons praise-icon">&#xe7d9;</span><span class="count">' +
        d[b].viewCount +
        "</span></span></div></li>";
      a++;
    }
  }
  if (c == "") {
    $(".other-works").remove();
    return;
  }
  $(".works-content").html(c);
}
function isColleted(a) {
  $.ajax({
    url: "/templates/" + a + "/liked",
    type: "get",
    success: function (b) {
      var c = $("[chartid = " + a + "] .collet-btn .icons");
      if (b.liked) {
        c.html("&#xe7e0;");
      } else {
        c.html("&#xe7dc;");
      }
    },
  });
}
var activityList = [];
function getActivityList() {
  var a = this;
  $.ajax({
    url: "/activity/list",
    type: "post",
    success: function (c) {
      if (c.list && c.list.length > 0) {
        activityList = c.list;
        var b = activityList.length;
        for (j = 0; j < b; j++) {
          if (
            typeof chartSpecialIds != "undefined" &&
            chartSpecialIds &&
            chartSpecialIds.indexOf(activityList[j].specialId) > -1
          ) {
            $("#cloneBtn").attr("data-discounts", true);
            $("#clonePirce").text(activityList[j].price);
          }
        }
      }
    },
  });
}
function renderTemp(e) {
  var d = activityList.length;
  var c = "";
  for (var b = 0; b < e.length; b++) {
    if (e[b].chartId != chartId) {
      var a = false;
      if (d > 0) {
        for (j = 0; j < d; j++) {
          if (!activityList[j]) {
            continue;
          }
          if (
            e[b].specialIds &&
            e[b].specialIds.indexOf(activityList[j].specialId) > -1
          ) {
            a = true;
            e[b]["publicClonePrice"] = activityList[j].price;
          }
        }
      }
      var f =
        imagePath +
        "/chart_image/thumb/" +
        e[b].thumbnail +
        ".png?cid=" +
        e[b].chartId;
      if (e[b].category.indexOf("mind") >= 0) {
        f =
          imagePath +
          "/chart_image/thumb/mind/" +
          e[b].thumbnail +
          ".png?cid=" +
          e[b].chartId;
      } else {
        if (e[b].category.indexOf("board") >= 0) {
          f =
            "https://assets.processon.com/chart_image/thumb/'+chart.thumbnail+'.png";
        }
      }
      c +=
        '<li class="temp-list-item" chartid="' +
        e[b].chartId +
        '" data-pirce="' +
        e[b].publicClonePrice +
        '" data-discounts="' +
        a +
        '" ><div class="list-item-content"><div class="item-module"><div class="item-module-img">' +
        (a ? '<div class="activitySign">暑期生活</div>' : "") +
        '<div class="item-shade"><div class="collet-btn"><span class="icons">&#xe7dc;</span>收藏</div><div class="clone-btn">立即使用</div></div><img src="' +
        f +
        '"></div></div><h2>' +
        e[b].title +
        '</h2><div class="temp-item-owner">' +
        (e[b].talent
          ? "<img class='talent-lab' src='/assets/images/new/talent_lab.svg'>"
          : "") +
        "<img src='" +
        (e[b].owner
          ? "/photo/" + e[b].owner.userId + ".png"
          : "/assets/imgs/on.png") +
        '\'><span class="owner-name">' +
        (e[b].owner ? e[b].owner.fullName : "官方模板") +
        '</span><span class="collect" style="float:right">' +
        (e[b].publicClonePrice && e[b].publicClonePrice > 0
          ? "<span class='count'>￥" + e[b].publicClonePrice + "</span>"
          : "<span class='count free'>免费</span>") +
        "</span></div></div></li>";
    }
  }
  if (c == "") {
    $(".related-temp").remove();
    return;
  }
  $(".like-content").html(c);
  $(".item-module-img").mouseover(function () {
    if (!$(this).hasClass("hover")) {
      isColleted($(this).parents(".temp-list-item").attr("chartid"));
      $(this).addClass("hover");
    }
  });
  $(".related-temp .collet-btn").click(function (g) {
    g.stopPropagation();
    if (uc) {
      doFavouriteLike($(this).parents(".temp-list-item").attr("chartId"));
    } else {
      Util.loginWindow("open", function () {
        location.reload();
      });
    }
  });
  $(".related-temp .clone-btn").click(function (h) {
    h.stopPropagation();
    var g = $(this).parents(".temp-list-item");
    sessionStorage.setItem("showCoupon", g.attr("data-discounts"));
    sessionStorage.setItem("thePirce", g.attr("data-pirce"));
    newCreateConfirm(
      g.attr("chartId"),
      g.attr("teamId"),
      g.attr("orgId"),
      true
    );
  });
}
function doFavouriteLike(b) {
  var a = $("[chartid=" + b + "] .collet-btn");
  a.disable();
  Util.ajax({
    url: "/view/favouriteChart",
    data: {
      chartId: b,
    },
    success: function (c) {
      a.enable();
      if (c.result == "save") {
        $(a).find(".icons").html("&#xe7e0;");
      } else {
        $(a).find(".icons").html("&#xe7dc;");
      }
    },
  });
}
var follow = {
  following: false,
  unFollow: function (b, a, c) {
    if (this.following) {
      return;
    }
    this.following = true;
    $.confirm({
      content: "确定取消关注当前好友吗？",
      onConfirm: function () {
        $(b).disable();
        Util.get(
          "/start/unfollow",
          {
            followId: a,
          },
          function (d) {
            $(b).enable();
            if (d.result == "success") {
              b.removeClass("followed").text("关注");
              if (c) {
                c();
              }
            }
            follow.following = false;
          }
        );
      },
    });
  },
  saveFollow: function (b, a, c) {
    if (this.following) {
      return;
    }
    this.following = true;
    $(b).disable();
    Util.get(
      "/start/savefollow",
      {
        followIds: a,
      },
      function (d) {
        $(b).enable();
        if (d.result == "success") {
          b.addClass("followed").text("已关注");
          if (c) {
            c();
          }
        }
        follow.following = false;
      }
    );
  },
};
