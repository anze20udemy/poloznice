<!--
<?php
session_start();

if(!isset($_SESSION["username"])){
  header("location: ../login/login.php");
  exit;
}
$username = $_SESSION['username'];
?>


-->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />

    <title>Poloznice</title>
    <link rel="stylesheet" href="css/jquery.mobile-1.4.5.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/jquery.js"></script>
    <script src="js/jquery.mobile-1.4.5.js"></script>
    <script src="js/FileSaver.js"></script>

    <script src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js"></script>

    <script src="js/script.js"></script>






</head>
<body>

<!-- Start of first page -->
<div data-role="page" id="home">

    <header data-role="header" data-theme="b">
        <h1>Položnice</h1>
    </header>
    <div data-role="navbar">
        <ul>
            <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
            <li><a href="#addBill" data-transition="none" data-icon="plus" >Dodaj</a></li>
            <li><a href="#addQR" data-transition="none" data-icon="plus" >QR</a></li>
          <?php  if (isset($_SESSION['username'])) : ?>

              <li><a href="login/logout.php" data-transition="none" data-icon="home"><?php echo $username ?></a></li>
          <?php endif ?>

        </ul>
    </div>

    <div role="main" class="ui-content">
        <h3>Pregled neplačanih računov</h3>
        <p>Z aplikacijo lahko spremljate seznam računov.</p>

        <p>Uvoz txt datoteke.</p>

        <input type="file">
        <!--<button id="importQR">Uvozi QR</button>-->

        <div id="allBills">
            <h3>Vsi računi</h3>
            <div class="filterContainer">
                <input class="ui-filterable" name="filterBills" type="text" id="filterBills" placeholder="Izberi prejemnika...">
            </div>
            <br>


            <!--<ul id="stats" data-role="listview"  data-filter="true" data-filter-placeholder="Filtriraj po vseh poljih."  data-inset="true" ></ul>-->

            <ul id="stats" data-role="listview"></ul>
            <br>
            <div id="amounts">
            <div>Znesek vseh neplačanih računov je <span id="total"></span> €</div>
            <div>Znesek izbranih računov  <span id="filteredTotal"></span> €</div>
            </div>
            <br>
            <button id="overdueBills"  data-theme="a">Samo zapadli računi</button>
            <button id="bills"  data-theme="a">Vsi računi</button>
            <button id="clearBills" onclick="return confirm('Are you sure?')" data-theme="b">Pobriši vse</button>
            <button id="save-btn">Ustvari backup.json datoteko</button>
        </div>







    <div data-role="footer" data-position="fixed">
        <h4>Poloznice 2019</h4>
    </div><!-- /footer -->
</div><!-- /page -->
</div>



    <!-- Podstran za pregled vnosov -->
    <div data-role="page" id="addBill">

        <header data-role="header" data-theme="b">
            <h1>Poloznice 2019</h1>
        </header>
        <div data-role="navbar">
            <ul>
                <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>

                <li><a href="#addQR" data-transition="none" data-icon="plus" >QR</a></li>

            </ul>
        </div>

        <div role="main" class="ui-content">
            <h3>Ročno vnesi račun</h3>
            <form id="addForm">
                <label for="prejemnik">Vnesi prejemnika: </label>
                <input type="text" id="prejemnik">

                <label for="znesek">Vnesi znesek: </label>
                <input type="text" id="znesek">

                <label for="rokplacila">Vnesi rok plačila: </label>
                <input type="text" id="rokplacila">

                <button id="submitAdd" class="ui-btn ui-btn-b ui-corner-all" >Potrdi</button>
            </form>
        </div><!-- /content -->

        <footer data-role="footer" data-theme="b">
            <h4>Položnice &copy; 2019</h4>


        </footer>
    </div><!-- /page -->
<!-- Podstran za pregled vnosov -->
<div data-role="page" id="addQR">





    <header data-role="header" data-theme="b">
        <h1>Položnice</h1>
    </header>
    <div data-role="navbar">
        <ul>
            <li><a href="#home" data-transition="none" data-icon="home" >Domov</a></li>
            <li><a href="#addBill" data-transition="none" data-icon="plus" >Dodaj</a></li>

        </ul>
    </div>

    <div role="main" class="ui-content">
        <h1>Skeniraj kodo</h1>
    <video width="400px" id="preview"></video>




    </div><!-- /content -->
<!--    <script type="text/javascript">
    scanQR();


</script>-->

    <footer data-role="footer" data-theme="b">
        <h4>Položnice &copy; 2019</h4>


    </footer>

</div><!-- /page -->

</body>
</html>