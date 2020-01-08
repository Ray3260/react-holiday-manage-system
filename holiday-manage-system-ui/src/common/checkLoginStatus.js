import $ from 'jquery';

const checkLoginStatus = () => {
    // 调用ajax请求登录状态
    let isLogin = false;
    $.ajax({
        type: 'GET',
        url: '/check',
        async: false,
        success: function (res) {
            if (res === 'isChecked') {
                isLogin = true;
            }
        }
    });
    if (!isLogin) {
        // window.location.href = window.location.origin;
        $('#exampleModalCenter').modal({
            show: true
        });
    }
    return isLogin;
}

export default checkLoginStatus;