<?php
include_once ('db.php');

$query = $_POST['query'];

if(mysqli_query($conn,$query))
  echo "Račun je vnesen v bazo";
else
  echo"Vnos računa ni uspel";