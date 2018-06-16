﻿//校验表单数据方法（纯前端校验）
function validate_add_form() {
    // 校验用户名
    var empName = $("#empName_add_input").val();
    var regName = /^([a-zA-Z0-9_-]{6,16})|([\u4e00-\u9fa5]{2,5})$/;
    if (!regName.test(empName)) {
        show_validate_msg("#empName_add_input", "error", "姓名必须为6-16位数字和字母的组合 或 2-5位中文");
        return false;
    } else {
        show_validate_msg("#empName_add_input", "success", "");
    }
    //校验邮箱
    var email = $("#email_add_input").val();
    var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
    if (!regEmail.test(email)) {
        show_validate_msg("#email_add_input", "error", "邮箱格式不正确");
        return false;
    } else {
        show_validate_msg("#email_add_input", "success", "");
    }
    return true;
}

// 校验员工名
function validate_empName(ele) {
    //发送ajax请求校验用户名是否可用
    var empName = $(ele).val();
    $.ajax({
        url: "checkUser",
        data: "empName=" + empName,
        type: "POST",
        success: function (result) {
            if (result.message == "success"){
                show_validate_msg(ele, "success", "该姓名可用");
                $("#emp_save_btn").attr("ajax-va", "success");
            }else if(result.message == "error"){
                show_validate_msg(ele, "error", result.extend.va_msg);
                $("#emp_save_btn").attr("ajax-va", "error");
            }
        }
    });
}

//显示校验结果的提示信息
function show_validate_msg(ele, status, msg) {
    //清除当前元素的校验状态
    $(ele).parent().removeClass("has-success has-error");
    $(ele).next("span").text("");

    if (status == "success") {
        $(ele).parent().addClass("has-success");
        $(ele).next("span").text(msg);
    } else if (status == "error") {
        //渲染输入框,清空这个元素之前的样式
        $(ele).parent().addClass("has-error");
        //显示错误提示
        $(ele).next("span").text(msg);
    }
}

//重置表单
function reset_form(ele) {
    //清空表单数据 jQuery没有reset方法，DOM对象才有，因此取出DOM对象[0]
    $(ele)[0].reset();
    //清空表单样式
    $(ele).find("*").removeClass("has-error has-success");
    $(ele).find(".help-block").text("");
}

// 查出所有部门信息并显示在下拉列表中
function getDepts() {
    $.ajax({
        url: "depts",
        type: "GET",
        success: function (result) {
            //在下拉列表中显示部门信息
            $.each(result.extend.depts, function () {
                var optionEle = $("<option></option>")
                    .append(this.deptName).attr("value", this.deptId);
                optionEle.appendTo("#dept_add_select");
            })
        }
    });
}

//上传表单
function post_emp_form(){
    //模态框中填写的表单数据提交给服务器进行保存
    $.ajax({
        url: "emp",
        type: "POST",
        data: $("#empAddModal form").serialize(),
        success: function (result) {
            //后端校验成功
            if (result.message == "success") {
                //员工保存成功后，关闭模态框
                $('#empAddModal').modal('hide');
                // 将总记录数作为请求页码（mybatisConfig.xml中配置了相关属性，能保证获取最后一页信息）
                toPage(totalRecord);
            }
            //后端校验失败, 有哪个字段的错误信息，就显示哪个字段
            if(result.extend.errorFields != undefined){
                if (result.extend.errorFields.email != undefined) {
                    show_validate_msg("#email_add_input", "error", result.extend.errorFields.email);
                }
                if (result.extend.errorFields.empName != undefined) {
                    show_validate_msg("#empName_add_input", "error", result.extend.errorFields.empName);
                }
            }
            if(result.extend.va_msg != undefined){
                show_validate_msg("#empName_add_input", "error", result.extend.va_msg);
                $("#emp_save_btn").attr("ajax-va", "error");
            }
        }
    });
}