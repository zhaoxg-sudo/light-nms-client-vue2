import img from 'assets/img/shebei.fw.png'

$("document").ready(function () {
if (document.location.search.match(/type=embed/gi)) {

        window.parent.postMessage('resize', "*");

    }

 $('.online ').on('click', addProduct);


function addProduct(event) {

    var offset = $('#end').offset(), flyer = $('<img class="u-flyer" src="'+img+'"/>');

    flyer.fly({

        start: {

            left: event.pageX,

            top: event.pageY

        },

        end: {

            left: offset.left,

            top: offset.top,

            width: 20,

            height: 20

        }

    });


}


})

