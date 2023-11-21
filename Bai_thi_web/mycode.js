$(document).ready(function () {
    const api = '/api.aspx';
    function delete_customer(id, json) {
        var s;
        for (var item of json.data) {
            if (item.id == id) {
                s = item;
                break;
            }
        }
        var dialog_xoa = $.confirm({
            title: `Xác nhận xóa khách hàng <br>${s.id}`,
            content: `xác nhận xóa nhé `,
            buttons: {
                OKE: {
                    action: function () {
                        var data_gui_di = {
                            action: 'delete_customer',
                            id: id,
                        }

                        console.log(data_gui_di); // Kiểm tra dữ liệu trước khi gửi đi

                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_xoa.close();
                                cap_nhap_customer();
                            }
                            else {
                                alert(json.msg);
                            }
                        })
                    },
                    NO: function () {
                        // Hủy bỏ thao tác
                    }
                }
            }
        })
    }
    function edit_customer(id, json) {
        var customerData;
        for (var item of json.data) {
            if (item.id == id) {
                customerData = item;
                break;
            }
        }

        var content = `
        <form>
            <div class="mb-3">
                <label for="edit-fullName" class="form-label">Họ và tên:</label>
                <input type="text" class="form-control" id="edit-fullName" value="${customerData.fullName}">
            </div>
            <div class="mb-3">
                <label for="edit-sex" class="form-label">Giới tính:</label>
                <input type="text" class="form-control" id="edit-sex" value="${customerData.sex}">
            </div>
            <div class="mb-3">
                <label for="edit-idNunber" class="form-label">CCCD:</label>
                <input type="text" class="form-control" id="edit-idNunber" value="${customerData.idNunber}">
            </div>
            <div class="mb-3">
                <label for="edit-phone" class="form-label">SDT:</label>
                <input type="text" class="form-control" id="edit-phone" value="${customerData.phone}">
            </div>
            <div class="mb-3">
                <label for="edit-address" class="form-label">Địa chỉ:</label>
                <input type="text" class="form-control" id="edit-address" value="${customerData.address}">
            </div>
        </form>
    `;

        var dialog_edit = $.confirm({
            title: 'Sửa thông tin khách hàng',
            content: content,
            columnClass: 'medium',
            buttons: {
                save: {
                    text: 'Lưu',
                    btnClass: 'btn-primary',
                    action: function () {
                        var data_gui_di = {
                            action: 'edit_customer',
                            fullName: $('#edit-fullName').val(),
                            sex: $('#edit-sex').val(),
                            idNunber: $('#edit-idNunber').val(),
                            phone: $('#edit-phone').val(),
                            address: $('#edit-address').val(),
                            id: parseInt(id, 10),
                        };

                        console.log(data_gui_di); // Kiểm tra dữ liệu trước khi gửi đi

                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_edit.close();
                                cap_nhap_customer();
                            } else {
                                alert(json.msg);
                            }
                        });
                    }
                },
                cancel: {
                    text: 'Hủy bỏ',
                    btnClass: 'btn-secondary',
                    action: function () {
                        // Hủy bỏ thao tác
                    }
                }
            }
        });
    }


    function cap_nhap_customer() {
        $.post(api, { action: 'list_customer' }, function (data) {
            var json = JSON.parse(data);
            var noi_dung_ds_sinh_vien = "";
            var stt = 0;

            // Thêm ô nhập và nút tìm kiếm bên ngoài bảng
            noi_dung_ds_sinh_vien += `
            <div class="search-container">
                <input type="text" id="search-input" class="form-control" placeholder="Nhập từ khóa...">
                <button id="search-button" class="btn btn-primary" onclick="searchCustomer()">Tìm kiếm</button>
            </div>
            <!-- Thêm nút Reset để làm mới danh sách -->
            <button id="reset-button" class="btn btn-secondary" onclick="resetList()">Làm mới danh sách</button>`;

            if (json.ok) {
                // Tạo bảng hiển thị danh sách khách hàng
                noi_dung_ds_sinh_vien += `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                                <th>CCCD</th>
                                <th>SDT</th>
                                <th>Địa chỉ</th>
                                <th>Sửa/Xóa</th>
                            </tr>
                        </thead>
                        <tbody>`;

                for (var sv of json.data) {
                    var sua_xoa = `<button class="btn btn-sm btn-warning nut_sua_xoa" data-cid="${sv.id}" data-action="edit_company">Sửa</button>`;
                    sua_xoa += ` <button class="btn btn-sm btn-warning nut_sua_xoa" data-cid="${sv.id}" data-action="delete_company">Xóa</button>`;

                    noi_dung_ds_sinh_vien += `
                    <tr>
                        <td>${++stt}</td>
                        <td>${sv.fullName}</td>
                        <td>${sv.sex}</td>
                        <td>${sv.idNunber}</td>
                        <td>${sv.phone}</td>
                        <td>${sv.address}</td>
                        <td>${sua_xoa}</td>
                    </tr>`;
                }

                noi_dung_ds_sinh_vien += "</tbody></table></div>";
            } else {
                noi_dung_ds_sinh_vien += "Không có dữ liệu";
            }

            // Hiển thị nội dung vào thành phần có id="ds_sinh_vien"
            $('#ds_sinh_vien').html(noi_dung_ds_sinh_vien);

            // Gán sự kiện click cho các nút Sửa/Xóa
            $('.nut_sua_xoa').click(function () {
                var action = $(this).data('action');
                var id = $(this).data('cid');
                if (action == 'delete_company') {
                    delete_customer(id, json);
                } else if (action == 'edit_company') {
                    edit_customer(id, json);
                }
            });
        });
    }

   
    function add_customer() {
        var content = `
        <form>
            <div class="mb-3">
                <label for="nhap-fullName" class="form-label">Tên khách hàng:</label>
                <input type="text" class="form-control" id="nhap-fullName">
            </div>
            <div class="mb-3">
                <label for="nhap-sex" class="form-label">Giới tính:</label>
                <input type="text" class="form-control" id="nhap-sex">
            </div>
            <div class="mb-3">
                <label for="nhap-idNunber" class="form-label">Nhập CCCD:</label>
                <input type="text" class="form-control" id="nhap-idNunber">
            </div>
            <div class="mb-3">
                <label for="nhap-phone" class="form-label">SDT:</label>
                <input type="text" class="form-control" id="nhap-phone">
            </div>
            <div class="mb-3">
                <label for="nhap-address" class="form-label">Địa chỉ:</label>
                <input type="text" class="form-control" id="nhap-address">
            </div>
        </form>
    `;

        $.confirm({
            title: 'Thêm mới khách hàng',
            content: content,
            columnClass: 'medium',
            buttons: {
                save: {
                    text: 'Thêm',
                    btnClass: 'btn-primary',
                    action: function () {
                        var data_gui_di = {
                            action: 'add_customer',
                            fullName: $('#nhap-fullName').val(),
                            sex: $('#nhap-sex').val(),
                            idNunber: $('#nhap-idNunber').val(),
                            phone: $('#nhap-phone').val(),
                            address: $('#nhap-address').val(),
                        };

                        console.log(data_gui_di); // Kiểm tra dữ liệu trước khi gửi đi

                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                cap_nhap_customer();
                            } else {
                                alert(json.msg);
                            }
                        });
                    }
                },
                cancel: {
                    text: 'Hủy bỏ',
                    btnClass: 'btn-secondary',
                    action: function () {
                        // Hủy bỏ thao tác
                    }
                }
            }
        });
    }

  function list_customer() {
        var dialog_list_sinhvien = $.confirm({
            title: "Danh sách khách hàng",
            content: `<div id ="ds_sinh_vien">loading....</div>`,
            columnClass: 'large',
            buttons: {
                ADD: {
                    text: 'Thêm khách hàng',
                    action: function () {
                        add_customer();
                        return false;
                    }
                },
                Close: {

                }
            },
            onContentReady: function () {
                //alert('oke rồi đấy')
                cap_nhap_customer();
            }
        });
    }









    function delete_room(ID, json) {
        var p;
        for (var item of json.data) {
            if (item.ID == ID) {
                p = item;
                break;
            }
        }
        var dialog_xoa = $.confirm({
            title: `Xác nhận trả phòng <br>${p.ID}`,
            content: `xác nhận `,
            buttons: {
                OKE: {
                    action: function () {
                        var data_gui_di = {
                            action: 'delete_room',
                            ID: ID,
                        }
                        console.log(data_gui_di); // Kiểm tra dữ liệu trước khi gửi đi

                        $.post(api, data_gui_di, function (data) {
                            console.log("Received data from server:", data);
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_xoa.close();
                                cap_nhap_room();
                            }
                            else {
                                alert(json.msg);
                            }
                        })
                    },
                    NO: function () {
                        // Hủy bỏ thao tác
                    }
                }
            }
        })
    }
    function edit_room(ID, json) {
        var p;
        for (var item of json.data) {
            if (item.ID == ID) {
                p = item;
                break;
            }
        }
        var content = `form điền sẵn
        Mã phòng  : <input type=text id="edit-ID" value="${p.ID}"><br>
        Họ và tên :<input type=text id="edit-Name" value="${p.Name}"><br>
        Trạng thái :<input type=text id="edit-status" value="${p.status}"><br>
        giá :<input type=text id="edit-price" value="${p.price}"><br>
        người tạo :<input type=text id="edit-createby" value="${p.createby}"><br>
        ngày sửa :<input type=date id="edit-editdate" value="${p.editdate}"><br>
        sửa bởi :<input type=text id="edit-editby" value="${p.editby}"><br>
    `;

        var dialog_edit = $.confirm({
            title: 'edit phòng',
            content: content,
            columnClass: 'large',
            buttons: {
                save: {
                    action: function () {
                        var data_gui_di = {
                            action: 'edit_room',
                            ID: $('#edit-ID').val(),
                            Name: $('#edit-Name').val(),
                            status: $('#edit-status').val(),
                            price: $('#edit-price').val(),
                            createby: $('#edit-createby').val(),
                            editdate: $('#edit-editdate').val(),
                            editby: $('#edit-editby').val(),
                        };

                        console.log(data_gui_di); // Kiểm tra dữ liệu trước khi gửi đi

                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_edit.close();
                                cap_nhap_room();
                            } else {
                                alert(json.msg);
                            }
                        });
                    },
                    cancel: function () {
                        // Hủy bỏ thao tác
                    }
                }
            }
        });
    }

    function cap_nhap_room() {
        $.post(api,
            {
                action: 'list_room'
            },
            function (data) {
                var json = JSON.parse(data);
                //alert(data)
                var noi_dung_ds_phong = "";
                var stt = 0;
                if (json.ok) {
                    noi_dung_ds_phong += `<table class="table table-hover">"
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th>số phòng</th>
                                <th>Họ và tên</th>
                                <th>Trạng thái phòng</th>
                                <th>giá phòng</th>
                              
                                <th>Sửa/Xóa</th>
                            </tr>
                            </thead><tbody>`;
                    for (var ph of json.data) {
                        var sua_xoa = `<button class="btn btn-sm btn-warning nut_sua_xoa" data-cid="${ph.ID}" data-action="edit_room">Sửa</button>`;
                        sua_xoa += ` <button class="btn btn-sm btn-warning nut_sua_xoa" data-cid="${ph.ID}" data-action="delete_room">Xóa</button>`;

                        noi_dung_ds_phong += `
                                <tr>
                                <td>${++stt}</td>
                                 <td>${ph.ID}</td>
                                <td>${ph.Name}</td>
                                <td>${ph.status}</td>
                                <td>${ph.price}</td
                            
                                <td>${sua_xoa}</td>
                            </tr>
                                `
                    }
                    noi_dung_ds_phong += "</tbody></table>";
                }
                else {
                    noi_dung_ds_phong += "không có dữ liệu";
                }

                $('#ds_phong').html(noi_dung_ds_phong);// gán html vào thân diaglo
                $('.nut_sua_xoa').click(function () {
                    var action = $(this).data('action')
                    var ID = $(this).data('cid')
                    if (action == 'delete_room') {
                        delete_room(ID, json);
                    }
                    else if (action == 'edit_room') {
                        edit_room(ID, json);
                    }
                });
            })
    }
 
 

    function list_room() {
        var dialog_list_room = $.confirm({
            title: "Danh sách phòng",
            content: `<div id ="ds_phong">loading....</div>`,
            columnClass: 'large',
            buttons: {
                Close: {

                }
            },
            onContentReady: function () {
                //alert('oke rồi đấy')
                cap_nhap_room();
            }
        });
    }
    $('#nut-sinh-vien').click(function () {
        list_customer();
    })
    $('#nut-phong').click(function (){
            list_room();
        });
});
