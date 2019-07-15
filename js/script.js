
$(document).one('pageinit', function (e) { // zato damo one, da se naloži samo enkrat
    e.preventDefault();
    $('#bills').hide();
    $('#overdueBills').show();

    let localStor = localStorage.getItem('bills');

    // Če v localStorage ni vpisov, naj se prebere iz backup datoteke.
    if (!localStor) {
        readJson();
    }


    let jsonBills = JSON.stringify(localStor, null, 2);
    jsonBills = jsonBills.slice(1,-1).replace(/\\/g, '');

    getUsername();
    let username = localStorage.getItem('username');




    function scanQR() {

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

    let bills = getBillsObject();

    scanner.addListener('scan', function (content) {


        var lines = content.split('\n');

        var znesek = lines[8];
        var namen = lines[12];
        var rokplacila = parseToMilliseconds(lines[13]);
        var iban = lines[14]
        var referenca = lines[15];
        var prejemnik = replaceChar(lines[16]);


        var QR = {
            znesek: znesek,
            namen: replaceChar(namen),
            rokplacila: rokplacila,
            iban: iban,
            referenca: referenca.substr(4,20), // brez SI12
            prejemnik: replaceChar(prejemnik),
            username: username

        };
        bills.push(QR);
        $.post( "../db/billsInsert.php",{ query: `INSERT INTO bills (znesek, namen, rokplacila, iban, referenca, prejemnik, username ) 
                                VALUES ('${znesek}', '${namen}', '${rokplacila}', '${iban}', '${referenca}', '${prejemnik}', '${username}')` } )
            .done(function( data ) {
                alert( data );
            });

        alert('Prejemnik: ' + prejemnik + '\n' +
            'Znesek: ' + parseFloat(parseInt((znesek))/100).toFixed(2).toString().replace('.', ',') + ' €' + '\n' +
            'Rok plačila:' + (new Date(rokplacila)).getUTCDate() + '.' + ((new Date(rokplacila)).getMonth()+1) + '.' + (new Date(rokplacila)).getFullYear() );
        window.location.href = '#home';
        location.reload();



    });

    Instascan.Camera.getCameras().then(function (cameras) {

        if (cameras.length > 0) {

            scanner.start(cameras[0]);

        } else {

            console.error('No cameras found.');

        }

    }).catch(function (e) {

        console.error(e);

    });
}

    let now = Date.now();

    showBillsDB();

    function getUsername() {

        $.ajaxSetup({cache: false})
        $.get('../db/getsession.php', function (data) {
            let username = data;
            localStorage.setItem('username', username);

        });

    }


    /*$('#importQR').on('tap',importQRData);*/

    /*$('.ui-content').on('keyup', showAmount);*/
    $('.ui-content').on('keyup', function (e) {
        let filter = e.target.value;
        $('#stats').html('');  // Počistimo vse račune pred filtriranjem
        $('#total').html('');  // Počistimo znesek vseh neplačanih računov
        $('#filteredTotal').html(''); // Počistimo znesek izbranih računov

        var bills = getBillsObject();
        var totalBills = document.getElementById("total");
        var filteredBills = document.getElementById("t");
        if (bills != '' && bills != null) {
            let total = 0;
            let filteredTotal = 0;
            let totalOver = 0;
            // let now = Date.now;
            let overTime = 0;

            for (var i = 0; i < bills.length; i++) {
                // Podatki iz array-a
                var znesek = parseFloat(parseInt(bills[i]["znesek"])/100).toFixed(2);
                var namen = bills[i]["namen"];
                var placilniRok = new Date(bills[i]["rokplacila"]);
                var rokplacila = placilniRok.getUTCDate()  + '.' + (placilniRok.getMonth()+1) + '.' + placilniRok.getFullYear();

                var iban = bills[i]["iban"];
                var referenca = bills[i]["referenca"];
                var prejemnik = bills[i]["prejemnik"];
                total = ((parseFloat(total) + parseFloat(znesek)).toFixed(2)).toString().replace('.', ',');


                if (prejemnik.toLowerCase().includes(filter.toLowerCase())) {
                    filteredTotal = (parseFloat(filteredTotal) + parseFloat(znesek)).toFixed(2);
                    $('#stats').append(
                        `<li class="ui-body-inherit ui-li-static">

                    <strong>Prejemnik: </strong>${prejemnik}
                    <br>
                    <strong>Znesek: </strong><span class="amount">${znesek} </span><strong>Rok plačila: </strong>${rokplacila}
                    <br>
                    <strong>IBAN: </strong>${iban} <strong>referenca: </strong>${referenca}
 
                    </li>`);
                    if (filteredTotal === 0) {
                        console.log('test');
                    } else{
                        $('#filteredTotal').html(filteredTotal);
                    }


                }

                $('#total').html(total);


            }




            $('#home').bind('pageinit', function () {
                $('#stats').listview('refresh');

            });

        } else {
            $('#stats').html('<p>Trenutno ni vpisov.</p>');
        }



    });

    $('#overdueBills').on('tap', overdueBills);
    $('#bills').on('tap', function () {
        window.location.href="../index.php";
    } );

    // Delete handler
    $('#stats').on('tap','#deleteLink', deleteBill);

    $('#clearBills').on('tap', clearBills);

    importQR();

    $('#submitAdd').on('tap', addBill);
    $('#addQR').on('tap', scanQR());

    function importQR() {
    const input = document.querySelector('input[type="file"]');
    input.addEventListener('change', function (e) {
        // console.log(input.files);
        var readerOrig = new FileReader();
        var reader = readerOrig;
        csvObject = [];

       var tempQR = [];
       // var bills = [];

        reader.onload = function () {
            var lines = reader.result.split('\n');
            var znesek = lines[8]
            var namen =lines[12];
            var rok = lines[13];
            var rokplacila = parseToMilliseconds(rok);
            var iban = lines[14]
            var referenca = lines[15];
            var prejemnik = lines[16];

            var QR = {
                znesek: znesek,
                namen: namen,
                rokplacila: rokplacila,
                iban: iban,
                referenca: referenca,
                prejemnik: prejemnik,

            };

            tempQR.push(QR);

            $.post( "../db/billsInsert.php",{ query: `INSERT INTO bills (znesek, namen, rokplacila, iban, referenca, prejemnik, username ) 
                                VALUES ('${znesek}', '${namen}', '${rokplacila}', '${iban}', '${referenca}', '${prejemnik}', '${username}')` } )
                .done(function( data ) {
                    alert( data );
                    window.location.href = "index.php";
                });

            alert('Prejemnik: ' + prejemnik + '\n' +
                'Znesek: ' + parseFloat(parseInt((znesek))/100).toFixed(2).toString().replace('.', ',') + ' €' + '\n' +
                'Rok plačila:' + (new Date(rokplacila)).getUTCDate() + '.' + ((new Date(rokplacila)).getMonth()+1) + '.' + (new Date(rokplacila)).getFullYear() );

            csvObject.push(lines);

            localStorage.setItem('tempQR', JSON.stringify(tempQR));
            console.log(tempQR);


        };
        reader.readAsText(input.files[0]);
    },false);
}
    function showAmount() {
    let allHidden = new Array;
    let value = 0;
    let amount = 0;
    let totalAmount = new Array;
    let allValue = 0;
    let allAmount = 0;

    totalAmount = $( ".amount"); // Vse prikazane vrednosti pred filtriranjem
    for (var i = 0; i < totalAmount.length; i++) {

        allValue =  parseFloat(totalAmount[i].innerHTML);
        allAmount = allAmount + allValue;

    }
    allHidden = $( ".amount", ".ui-screen-hidden"  ); // Vsi, ki jih filter skrije
    for (var i = 0; i < allHidden.length; i++) {

        value =  parseFloat(allHidden[i].innerHTML);
        amount = amount + value;

    }


    let difference = (allAmount - amount).toFixed(2);





    // let amount = hidden.find('.amount');
    // amount = amount.length;



    $('#filteredTotal').html(difference);



}

    function showBills() {
        // get bills object
        var bills = getBillsObject();
        var totalBills = document.getElementById("total");

        if (bills != '' && bills != null) {
            let total = 0;
            let totalOver = 0;
            // let now = Date.now;
            let overTime = 0;
            let id = i;

            for (var i = 0; i < bills.length; i++) {
                // Podatki iz array-a
                var znesek = parseFloat(parseInt(bills[i]["znesek"])/100).toFixed(2).toString().replace('.', ',');
                var namen = bills[i]["namen"];
                var placilniRok = new Date(parseInt(bills[i]["rokplacila"]));
                var rokplacila = placilniRok.getUTCDate()  + '.' + (placilniRok.getMonth()+1) + '.' + placilniRok.getFullYear();
                var billid = bills[i]['billId'];

                var ib = bills[i]["iban"];
                var iban = ib.substring(0,4) + ' ' + ib.substring(4,8) + ' ' + ib.substring(8,12) + ' ' + ib.substring(12,16) + ' ' + ib.substring(16,20);
                var ref = bills[i]["referenca"];
                var referenca = ref.substring(0,4) + ' ' + ref.substring(4,17);
                var prejemnik = bills[i]["prejemnik"];
                total = (parseFloat(total) + parseFloat(znesek)).toFixed(2).toString().replace('.', ',');

                $('#stats').append(
                    `<li class="ui-body-inherit ui-li-static">

                    <strong>Prejemnik: </strong>${prejemnik}
                    <br>
                    <strong>Znesek: </strong><span class="amount">${znesek} </span><strong>Rok plačila: </strong>${rokplacila}
                    <br>
                    <strong>IBAN: </strong>${iban} <strong>referenca: </strong>${referenca}
                    <br>
                    <div class="controls"> 
                        
                        <a href="#" id="deleteLink" data-billid='${billid}' data-referenca='${referenca}' data-znesek='${znesek}' >Odstrani</a>
                     </div>
 
                    </li>`);
            }

            $('#total').append(total);


            $('#home').bind('pageinit', function () {
                $('#stats').listview('refresh');

            });

        } else {
            $('#stats').html('<p>Trenutno ni vpisov.</p>');
        }



    }
    function showBillsDB() {
        $.ajax({

            url : '../db/billsView.php', // my php file
            type : 'GET', // type of the HTTP request
            dataType: 'json',

            success : function(data){
                localStorage.setItem('bills', JSON.stringify(data));
                showBills(); /// prikaz vseh vpisov v podstrani #statistics


            }
        });

    }
    function clearBills() {


        let username = localStorage.getItem('username');
        var result =window.confirm('Ali ste prepričani?');
        if (result == true) {
            var confirm =window.confirm('To dejanje bo zbrisalo vse vnose v bazi!');

            if (confirm == true) {

                localStorage.removeItem('bills');

                $.post( "../db/billsDeleteAll.php",{ query: "DELETE FROM bills  WHERE username='" + username + "'"  } )
                    .done(function( data ) {
                        alert( data );

                    });
                $('#stats').html('<p>Trenutno nimate vnosov</p>');
            } else {
                window.location.href = "#home";
            }
        } else {
            window.location.href = "#home";
        }
    }

    // Brisanje posameznega vnosa
    function deleteBill () {

        var confirm =window.confirm('Ali res želite zbrisati vnos');

        if (confirm == true) {
            // Set localstorage items

            localStorage.setItem('currentZnesek', $(this).data('znesek'));
            localStorage.setItem('currentReferenca', $(this).data('referenca'));
            localStorage.setItem('currentBillId', $(this).data('billid'));



            // Get current data

            var currentZnesek = localStorage.getItem('currentZnesek');
            var currentReferenca = localStorage.getItem('currentReferenca');
            var currentBillId = localStorage.getItem('currentBillId');




            var bills = getBillsObject();

/*            // Loop through punches
            for (var i = 0; i < bills.length; i++) {
                if (bills[i].referenca === currentReferenca) {
                    bills.splice(i,1);
                }
                localStorage.setItem('bills', JSON.stringify(bills));
            }*/
            $.post( "../db/billsDelete.php",{ query: "DELETE FROM bills WHERE billId="+currentBillId} )
                .done(function( data ) {
                    alert( data );
                    location.reload();
                });


            // alert('Vnos je bil odstranjen');


            // Redirect

            // location.reload();

            return false;


        } else {
            window.location.href = "index.php";
            location.reload();
        }


    }

    function overdueBills() {
        // get bills object
        $('#stats').html(''); // Pobrišemo seznam računov
        $('#total').html(''); // Pobrišemo znesek vseh neplačanih računov
        $('#overdueBills').hide();
        $('#bills').show();
        $('input[name=filterBills]').val(''); // Pobrišemo vrednost input field-a
        var bills = getBillsObject();
        var totalBills = document.getElementById("total");

        if (bills != '' && bills != null) {
            let total = 0;
            let totalOver = 0;
            let overTime = 0;

            for (var i = 0; i < bills.length; i++) {
                // Podatki iz array-a

                var znesek = parseFloat(parseInt(bills[i]["znesek"])/100).toFixed(2);

                var namen = bills[i]["namen"];
                var placilniRok = new Date(bills[i]["rokplacila"]);
                var rokplacila = placilniRok.getUTCDate()  + '.' + (placilniRok.getMonth()+1) + '.' + placilniRok.getFullYear();

                var iban = bills[i]["iban"];
                var referenca = bills[i]["referenca"];
                var prejemnik = bills[i]["prejemnik"];
                if (now > placilniRok) {
                    total = (parseFloat(total) + parseFloat(znesek)).toFixed(2);
                } else {
                    total = parseFloat(total);
                }


                // if (now > placilniRok) {
                    $('#stats').append(
                        `<li class="ui-body-inherit ui-li-static">

                    <strong>Prejemnik: </strong>${prejemnik}
                    <br>
                    <strong>Znesek: </strong><span class="amount">${znesek} </span><strong>Rok plačila: </strong>${rokplacila}
                    <br>
                    <strong>IBAN: </strong>${iban} <strong>referenca: </strong>${referenca}
                   
              
                    </li>`);
                // }
                console.log(placilniRok);
                }



            $('#total').append(total);


            $('#home').bind('pageinit', function () {
                $('#stats').listview('refresh');

            });

        } else {
            $('#stats').html('<p>Trenutno ni vpisov.</p>');
        }
    }

    
    /*// Uvoz txt datoteke s podatki iz skenirane položnice
    function importQRData() {
        var currentBill = JSON.parse(localStorage.getItem('tempQR'));
        var znesek = currentBill[0]['znesek'];
        var namen = currentBill[0]['namen'];
        var rokplacila = currentBill[0]['rokplacila'];
        var iban = currentBill[0]['iban'];
        var referenca = currentBill[0]['referenca'];
        var prejemnik = currentBill[0]['prejemnik'];

        // Create 'bill' object

        var bill = {
            znesek: znesek,
            namen: namen,
            rokplacila: parseToMilliseconds(rokplacila),
            iban: iban,
            referenca: referenca,
            prejemnik: prejemnik,

        };
        // Add bill to bills array
        var bills = getBillsObject();

        bills.push(bill);

        alert('račun je bil dodan');

        // Set stringified object to local storage
        localStorage.setItem('bills', JSON.stringify(bills));
        window.location.href = "index.php";

        return false;

    }*/
    // Ročno dodan račun brez QR-ja
    function addBill() {
        var currentBill = JSON.parse(localStorage.getItem('tempQR'));
        var znesek = ($('#znesek').val()).toString().replace(',', '.')*100; // najprej spremenimo decimalno vejico v piko, zaradi oblikovanja števil
        // var znesek = znesekStr *100;
        var rokplacila = parseToMilliseconds($('#rokplacila').val());
        var prejemnik = $('#prejemnik').val();
        var namen = prejemnik;
        var iban = 'SI56123456789012345';
        var referenca = '';

        // Create 'bill' object

        var bill = {
            znesek: znesek,
            namen: namen,
            rokplacila: rokplacila,
            iban: iban,
            referenca: referenca,
            prejemnik: prejemnik,

        };
        // Add bill to bills array
        var bills = getBillsObject();

        bills.push(bill);
        $.post( "../db/billsInsert.php",{ query: `INSERT INTO bills (znesek, namen, rokplacila, iban, referenca, prejemnik, username ) 
                                VALUES ('${znesek}', '${namen}', '${rokplacila}', '${iban}', '${referenca}', '${prejemnik}', '${username}')` } )
            .done(function( data ) {
                alert( "Data Loaded: " + data );
            });

        alert('račun je bil dodan');

        // Set stringified object to local storage
        localStorage.setItem('bills', JSON.stringify(bills));

        window.location.href = '#home';
        location.reload();

        return false;

    }

    // Izbor vseh računov, ki so v objectu Bills
    function getBillsObject() {
        // Set punches array
        //noinspection JSDuplicatedDeclaration
        var bills = new Array();

        // Get current punches from localStorage
        var currentBills = localStorage.getItem('bills');

        // Check localStorage
        if (currentBills != null) {
            // Set to punches
            var bills = JSON.parse(currentBills);
        }

        // Prikaz računov in sortiranje poroku plačila
        return bills.sort(function (a, b) {return new Date(a.rokplacila) - new Date(b.rokplacila)});

    }
/*    function deleteBill () {

        var confirm =window.confirm('Ali res želite zbrisati vnos');

        if (confirm == true) {
            // Set localstorage items

            localStorage.setItem('currentZnesek', $(this).data('znesek'));
            localStorage.setItem('currentNamen', $(this).data('namen'));
            localStorage.setItem('currentRokplacila', $(this).data('rokplacila'));
            localStorage.setItem('currentIban', $(this).data('iban'));
            localStorage.setItem('currentReferenca', $(this).data('referenca'));
            localStorage.setItem('currentPrejemnik', $(this).data('prejemnik'));


            // Get current data

            var currentZnesek = localStorage.getItem('currentZnesek');
            var currentNamen = localStorage.getItem('currentNamen');
            var currentRokplacila = localStorage.getItem('currentRokplacila');
            var currentIban = localStorage.getItem('currentIban');
            var currentReferenca = localStorage.getItem('currentReferenca');
            var currentPrejemnik = localStorage.getItem('currentPrejemnik');


            var bills = getBillsObject();

            // Loop through bills
            for (var i = 0; i < bills.length; i++) {
                if (bills[i].znesek == currentZnesek && bills[i].namen == currentNamen && bills[i].rokplacila == currentRokplacila) {
                    bills.splice(i,1);
                }
                localStorage.setItem('bills', JSON.stringify(bills));
            }

            alert('Vnos je bil odstranjen');


            // Redirect

            location.reload();

            return false;


        } else {
            window.location.href = "#statistic";
        }


    }
    function setCurrent () {
        // Set localstorage items
        localStorage.setItem('currentZnesek', $(this).data('znesek'));
        localStorage.setItem('currentNamen', $(this).data('namen'));
        localStorage.setItem('currentRokplacila', $(this).data('rokplacila'));
        localStorage.setItem('currentIban', $(this).data('iban'));
        localStorage.setItem('currentReferenca', $(this).data('referenca'));
        localStorage.setItem('currentPrejemnik', $(this).data('prejemnik'));


        // Insert form fields
        var localZnesek = localStorage.getItem('currentZnesek');
        var localNamen = localStorage.getItem('currentNamen');
        var localRokplacila = localStorage.getItem('currentRokplacila');



        $('#editZnesek').val(localZnesek);
        $('#editNamen').val(localNamen);
        $('#editRokplacila').val(localRokplacila);

    }*/
    // Pretvorba iz formata dd.mm.llll v milisekunde
    function parseToMilliseconds (date) {
        var splitDate = date.split('.');
        var reformatDate = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
        var milliseconds = Date.parse(reformatDate);

        return milliseconds;

    }
/*    function openQRCamera(node) {
        var reader = new FileReader();
        reader.onload = function() {
            node.value = "";
            qrcode.callback = function(res) {
                if(res instanceof Error) {
                    alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
                } else {
                    node.parentNode.previousElementSibling.value = res;
                }
            };
            qrcode.decode(reader.result);
        };
        reader.readAsDataURL(node.files[0]);
    }*/
    // Izvoz vseh vpisov v txt datoteko
    $("#save-btn").click(function() {

        let  date = Date.now();
        let datetime = new Date(date);

        datetime = datetime.getUTCDate() + '_' + (datetime.getMonth()+1) + '_' + datetime.getFullYear();



        var blob = new Blob([jsonBills], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "backup.json");

    });

    // Funkcija za spremembo črk
    function replaceChar(str) {
        let string = str.replace(/è/g, 'č')
            .replace(/¹/g, 'š')
            .replace(/È/g, 'Č')
            .replace(/®/g, 'Ž');
        return string;
    }
    // Funkcija, ki prebere backup JSON datoteko, če je localstorage prazen
    function readJson() {

        $.ajax({
            url:'../backup.json',
            dataType: 'json',
            type: 'get',
            cache: false,
            success: function (data) {
                localStorage.setItem('bills', JSON.stringify(data));

            }
        })
    }

    function setCurrent () {
        // Set localstorage items
        localStorage.setItem('currentId', $(this).data('billId'));
        localStorage.setItem('currentZnesek', $(this).data('znesek'));
        localStorage.setItem('currentReferenca', $(this).data('referenca'));


        // Insert form fields
        var localRefeneca = localStorage.getItem('currentReferenca');
        var localZnesek = localStorage.getItem('currentZnesek');
        //var localZnesek = localStorage.getItem('currentZnesek');


    }

});