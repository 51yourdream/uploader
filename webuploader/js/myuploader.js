/* 
* @Author: lp
* @Date:   2015-10-19 10:19:49
* @Last Modified by:   lp
* @Last Modified time: 2015-10-19 17:04:42
*/

// 文件上传
jQuery(function() {
    var $ = jQuery,
        $list = $('#webuploader-filelist'),	//带上传文件容纳盒
        $btn = $('#webuploader-uploaderbtn'), //上传按钮
        state = 'pending',	//状态 表示等待
        uploader;	

    uploader = WebUploader.create({

        // 不压缩image
        resize: false,

        // swf文件路径
        swf: BASE_URL + 'js/Uploader.swf',

        // 文件接收服务端。
        server:BASE_URL + 'server/fileupload.php',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {id:'#webuploader-picker',innerHTML:'选择文件',multiple:true},	//文件选择器按钮 不指定则创建按钮
        dnd:"#webuploader-dropzone",	//拖拽区域
        disableGlobalDnd:true, //是否禁掉整个页面的拖拽功能
        paste:"document.body",
     //    accept:{
	    //     title:'Images',	//文字描述
	    //     extensions:'gif,jpg,jpeg,png',	//允许的文件后缀
	    //     mimeType:'image/*'				//mimeType 类型
    	// },
    	thumb:{ //配置生成缩略图选项
    		width:100,
    		height:100,
    		quality:70,	//图片质量，只有type为 ‘image/jpeg’的时候才有效
    		allowMagnify:true, //是否允许放大
    		crop:true,	//是否允许裁剪
    		type:'images/jpeg'	//为空则保留原有图片格式 否则强制转换成指定的类型
    	},
    	compress:{ //配置压缩图片的选项 如果此选项为 false 则图片在上传前不进行压缩
    		width:1600,
    		height:1600,
    		quality:90,
    		allowMagnify:false, // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
    		crop:false, //是否允许裁剪
    		preserverHeaders:true, //是否保留头部meta信息。
    		noCompressIfLarger:false, //如果发现压缩后的文件比原来还大，则使用原来图片 此属性可能会影响图片自动纠正功能
    		compressSize:0 //单位字节，如果图片小于此值，不会采用压缩。
    	},
    	auto:false, //是否自动上传
    	//runtimeOrder:'html5,flash',	//指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.可以将此值设置成 flash，来强制使用 flash 运行时。
    	prepareNextFile:false, //是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
    	chuncked:false, //是否要分片处理大文件上传。
    	chunkSize:5242880,	//如果要分片，分多大一片？ 默认大小为5M.
    	chunkRetry:2,	//如果某个分片由于网络问题出错，允许自动重传多少次？
    	threads:3,	//上传并发数。允许同时最大上传进程数
    	formData:{my:'12'},	//文件上传请求的参数表，每次发送都会发送此对象中的参数。
    	fileVal:'file',	//文件上传域的name值
    	method:'POST',	//文件上传方式 POST GET
    	sendAsBinary:false, //是否已二进制的流的方式发送文件，这样整个上传内容php://input都为文件内容， 其他参数在$_GET数组中。
    	fileNumLimit:10,	//验证文件总数量, 超出则不允许加入队列。
    	fileSizeLimit:524288000,	//验证文件总大小是否超出限制, 超出则不允许加入队列。
    	fileSingleSizeLimit:52428800, // 50M 验证单个文件大小是否超出限制, 超出则不允许加入队列。
    	//duplicate:'' //去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
    	//disableWidgets:'' //默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。

    });

    uploader.on('beforeFileQueued',function(file){	//当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
		//console.log(file.handler);
	});

    // 当有文件添加进来后触发的事件
    uploader.on( 'fileQueued', function( file ) {
        // $list.append( '<div id="' + file.id + '" class="item">' +
        //     '<h4 class="info">' + file.name + '</h4>' +
        //     '<p class="state">等待上传...</p>' +
        // '</div>' );
		$("#lpuploader #webuploader-dropzone .webuploader-list-container").css({padding:"0px"});
        if(!($("#lpuploader .pull-right").html())){
		        $("#webuploader-picker").remove();
		        $("#lpuploader").append('<div class="pull-right">'+
						'<div class="webuploader-file-add"></div>'+
						'<button class="btn btn-success" id="webuploader-uploaderbtn">开始上传</button>'+
					'</div>');
		       uploader.addButton({
	        	id:".webuploader-file-add",
	        	innerHTML:"添加文件"
        	});
        }
        
        
        uploader.makeThumb( file, function( error, ret ) {

               if ( error ) {
                  // $list.text('预览错误');
                   // $list.append('<span id="' + file.id + '" class="item"><img alt="默认图片" src="./images/1.jpg"/ width="100"><h4 class="info">' + file.name + '</h4><p class="state">等待上传...</p><button class="btn btn-danger delete-btn" obj="'+file+'">删除</button></span>');

                   	$list.append('<div class="uploader-img" id="'+file.id+'">'+
                   			'<img src="./images/1.jpg" alt="" width="120px" height="100px">'+
                   			'<span class="glyphicon glyphicon-remove deletebtn hidden"></span>'+
                   			'<div class="text-center webuploader-img-news" style="font-size:16px;">'+
                   				'<p>'+file.name+'</p>'+
                   				'<p>'+file.state+'</p>'+
                   			'</div>'+
                   		'</div>');

               } else {
                   // $list.append('<span id="' + file.id + '" class="item"><img alt="" src="' + ret + '" /><h4 class="info">' + file.name + '</h4><p class="state">等待上传...</p><button class="btn btn-danger delete-btn" obj="'+file.id+'">删除</button></span>');

                   $list.append('<div class="uploader-img" id="'+file.id+'">'+
                   		'<img src="'+ret+'" alt="" width="120px" height="100px">'+
                   		'<span class="glyphicon glyphicon-remove deletebtn hidden"></span>'+
                   		'<div class="text-center webuploader-img-news" style="font-size:16px;">'+
                   			'<p>'+file.name+'</p>'+
                   			'<p>'+file.state+'</p>'+
                   		'</div>'+
                   	'</div>');

               }
           });
        uploader.md5File(file).progress(function(percentage){
        	console.log('Percentage:', percentage);
        }).then(function(val){
        	console.log('md5 result:', val);
        });
    });

    uploader.on('filesQueued',function(files){ //files {File}数组，内容为原始File(lib/File）对象。 当一批文件添加进队列以后触发。 
    	alert('添加了一批文件');  //不知道为什么添加单个文件他也会触发该事件

    });

    uploader.on('fileDequeued',function(file){  //当文件被移除队列后触发

    });

    uploader.on('reset',function(){	//当uploadr被重置的时候触发
    	alert('uploader 被重置了');

    });

    uploader.on('startUpload',function(){ //当开始上传流程时触发。
    	alert('当开始上传流程时触发。');
    });

    uploader.on('stopUpload',function(){ //当开始上传流程暂停时触发。
    	alert('当开始上传流程暂停时触发。');

    });

    uploader.on('uploadFinished',function(){	//当所有上传文件结束上传时 触发
    	alert('所有上传文件都结束啦!');
    });

    uploader.on('uploadBeforeSend',function(object,data,headers){ //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。

    });

    uploader.on('uploadAccept',function(object,ret){ //当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
    	// console.log(object);
    	// console.log(ret);

    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if ( !$percent.length ) {	//上传过程中触发，携带上传进度。
            $percent = $('<div class="progress progress-striped active">' +
              '<div class="progress-bar" role="progressbar" style="width: 0%">' +
              '</div>' +
            '</div>').appendTo( $li ).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css( 'width', percentage * 100 + '%' );
    });

    uploader.on( 'uploadSuccess', function( file ,response) {
    	//console.log(response);
        $( '#'+file.id ).find('p.state').text('已上传');
        //uploader.destroy();		//销毁webuploader实例
    });



    uploader.on( 'uploadError', function( file ) {	//文件上传出错时触发
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    uploader.on( 'uploadComplete', function( file ) { //不管成功或者失败，文件上传完成时触发。
        $( '#'+file.id ).find('.progress').fadeOut();
    });

    uploader.on( 'all', function( type ) {
        if ( type === 'startUpload' ) {
            state = 'uploading';
        } else if ( type === 'stopUpload' ) {
            state = 'paused';
        } else if ( type === 'uploadFinished' ) {
            state = 'done';
        }

        if ( state === 'uploading' ) {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }
    });

    $btn.on( 'click', function() {
        if ( state === 'uploading' ) {
            uploader.stop();
        } else {
            uploader.upload();
        }
    });

    uploader.on('dndAccept',function(items){
		console.log(items);
	});

    var states = uploader.getStats();	//获取文件信息
    console.log(states);

    uploader.addButton({id:'btnContainer',innerHTML:'添加的选择按钮'});	//addButton中的参数 和options.pick 一致

    $list.on('click','.delete-btn',function(){	//删除等待上传的对象
    	console.log($(this).attr('obj'));
    	var id=$(this).attr('obj');
    	uploader.removeFile(id,true);
    	$( '#'+id ).find('p.state').text('已删除');
    });

    uploader.getFiles('error');	//返回指定状态的文件集合  问题 一共有几种状态 还不清楚
});



