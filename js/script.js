
$(document).one('pageinit', function (e) { // zato damo one, da se naloži samo enkrat
    e.preventDefault();

    showBills();
    $('#importQR').on('tap',importQRData);

    importQR();

    $('#submitAdd').on('tap', addBill);

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
            var namen = lines[12];
            var rokplacila = lines[13];
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

            csvObject.push(lines);

            localStorage.setItem('tempQR', JSON.stringify(tempQR));
            console.log(tempQR);


        };
        reader.readAsText(input.files[0]);
    },false);
}

    function showBills() {
        // get bills object
        var bills = getBillsObject();

        if (bills != '' && bills != null) {


            for (var i = 0; i < bills.length; i++) {
                // Podatki iz array-a
                var znesek = parseFloat(parseInt(bills[i]["znesek"])/100).toFixed(2);
                var namen = bills[i]["namen"];
                var placilniRok = new Date(bills[i]["rokplacila"]);
                var rokplacila = placilniRok.getUTCDate()  + '.' + (placilniRok.getMonth()+1) + '.' + placilniRok.getFullYear();

                var iban = bills[i]["iban"];
                var referenca = bills[i]["referenca"];
                var prejemnik = bills[i]["prejemnik"];


                $('#stats').append(
                    `<li class="ui-body-inherit ui-li-static">

                    <strong>Prejemnik: </strong>${prejemnik}
                    <br>
                    <strong>Znesek: </strong>${znesek} <strong>Rok plačila: </strong>${rokplacila}
                    <br>
                    <strong>IBAN: </strong>${iban} <strong>referenca: </strong>${referenca}
                    
                
                    
                   
                
                    </li>`);
            }

            $('#home').bind('pageinit', function () {
                $('#stats').listview('refresh');

            });

        } else {
            $('#stats').html('<p>Trenutno ni vpisov.</p>');
        }

    }

    

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

        return false;

    }
    function addBill() {
        var currentBill = JSON.parse(localStorage.getItem('tempQR'));
        var znesek = $('#znesek').val();
        var rokplacila = $('#rokplacila').val();
        var prejemnik = $('#prejemnik').val();

        // Create 'bill' object

        var bill = {
            znesek: znesek*100,
            namen: '                   ',
            rokplacila: parseToMilliseconds(rokplacila),
            iban: 'SI56123456789012345',
            referenca: '',
            prejemnik: prejemnik,

        };
        // Add bill to bills array
        var bills = getBillsObject();

        bills.push(bill);

        alert('račun je bil dodan');

        // Set stringified object to local storage
        localStorage.setItem('bills', JSON.stringify(bills));

        window.location.href = "index.html";

        return false;

    }
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
});