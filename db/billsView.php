<?php
session_start();
  include_once ('db.php');
  

    // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

// 2) Query database for data
//--------------------------------------------------------------------------
//  $user_id = 1;
  $username =  $_SESSION['username'];

  $result = mysqli_query($conn, "SELECT * FROM bills WHERE username='$username'");          //query
  $array = [];


  while($enr = mysqli_fetch_assoc($result)){
    $a = array('znesek'=>$enr['znesek'],'namen'=>$enr['namen'],'rokplacila'=>$enr['rokplacila'],'billId'=>$enr['billId'],'iban'=>$enr['iban'],'referenca'=>$enr['referenca'],'prejemnik'=>$enr['prejemnik'],'username'=>$enr['username']);
    array_push($array, $a);
  }

//--------------------------------------------------------------------------
// 3) echo result as json
//--------------------------------------------------------------------------
echo json_encode($array);



