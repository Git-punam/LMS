/**
 * @description object for months having 31 days
 * @scope Global
 */
 const arr31 = {
    1 : "january",
    3 : "march",
    5:  "may",
    7:  "july",
    8: "august",
    10: "october",
    12 : "december",
    arr31Method: function(val){
            return Object.keys(this).includes(val.toString())
    }
}

/**
 * @description object for months having 30 days
 * @scope Global
 */
const arr30 = {
    4 : "april",
    6 : "june",
    9:  "september",
    11:  "november",
    arr30Method: function(val){
        return Object.keys(this).includes(val.toString())
}
}



/**
 * @description Return_date calculation
 * @param Issue_date, Return_date(empty)
 * @Issue_date_format dd-mm-yyyy
 */
export const returnDateCalc = (Issue_date,Return_date)=>{
    
    let dd = 7 + Number(Issue_date.substr(0,2));//'substr(0,2)' extract substring from position 0 with length=2
    let mm = Number(Issue_date.substr(3,2));//'substr(3,2)' extract substring from position 3 with length=2
    let yyyy = Number(Issue_date.substr(6));//'substr(6)' extract rest of the substring from position 6

    //if the month is apr/jun/sep/nov
    if(arr30.arr30Method(mm)){
        if(Math.floor(dd/30) > 0) mm = mm + 1;
        dd = dd % 30;
    }   
    //if the month is jan/mar/may/jul/aug/oct/dec  
    else if(arr31.arr31Method(mm)) {
        if(Math.floor(dd/31) > 0) mm = mm + 1;
        dd = dd % 31;
    }       
    else {
        //checking leap year or not
            if( yyyy % 4 == 0 ) {
                if( Math.floor(dd/29)>0) mm = mm + 1;
                dd = dd % 29;
            }
            else { 
                if( Math.floor(dd/28)>0) mm = mm + 1;
                dd = dd % 28;
            }
        }
    if( Math.floor(mm/12) > 0) {yyyy = yyyy + 1; mm = mm % 12;}
    let ddS = (dd < 10) ? ('0'+ dd.toString()) : dd.toString()
    let mmS = (mm < 10) ? ('0'+ mm.toString()) : mm.toString()
    let yyS = yyyy.toString()
    Return_date = ddS + '-'+ mmS + '-' + yyS
    return Return_date
}




/**
 * @description Late fine/charges calculation
 * @param Return_date, Actual_return_date
 * @Return_date_format dd-mm-yyyy
 * @Actual_return_date_format dd-mm-yyyy
 */
export const fineCalc = (Return_date, Actual_return_date)=>{

    let Charges_Rs = 0;

    let yyyyReturn = Number(Return_date.substring(6))//'substring(6)' extract rest of the substring from position 6
    let yyyyActual = Number(Actual_return_date.substring(6))

    let mmReturn = Number(Return_date.substring(3,5))//'substr(3,5)' extract substring from position 3 to 4
    let mmActual = Number(Actual_return_date.substring(3,5))

    let ddReturn = Number(Return_date.substring(0,2))//'substring(0,2)' extract substring from position 0 to 1
    let ddActual = Number(Actual_return_date.substring(0,2))

    let yCountLeap = 0, yCountLeapNot = 0, count31 = 0, count30 = 0, count29 = 0, count28 = 0;

    
    function countRemainingDays(val){
        //if the current month is apr/jun/sep/nov
        if(arr30.arr30Method(val)) Charges_Rs = 30 - ddReturn;
        //if the current month is jan/mar/may/jul/aug/oct/dec
        else if(arr31.arr31Method(val)) Charges_Rs = 31 - ddReturn;
        else 
        {
            if( yyyyReturn % 4 == 0 ) Charges_Rs = 29 - ddReturn;
            else Charges_Rs = 28 - ddReturn;
        }
    }

    function monthCountTotal(val){
        if(arr30.arr30Method(val)) count30++;
        else if(arr31.arr31Method(val)) count31++;
            else 
            {   //the month is 'feb'
                //checking leap year or not
                if( yyyyActual % 4 == 0 ) count29++;
                else count28++;
            }
    }


    //book returned in the same year
    if(yyyyActual-yyyyReturn == 0)
    {
        //book returned in the same month
        if(mmActual-mmReturn == 0) Charges_Rs = ddActual - ddReturn; 
        
        //book returned in later months
        else if(mmActual-mmReturn > 0)
        {
            countRemainingDays(mmReturn)
            for(var i = mmReturn + 1; i < mmActual; i++)
            {
                monthCountTotal(i)
            }
            Charges_Rs = Charges_Rs + (count30*30 + count31*31 + count29*29 + count28*28) + ddActual
        }
    }

    //book returned in later year,not in the same year
    else if(yyyyActual-yyyyReturn > 0)
    {
        countRemainingDays(mmReturn)
        
        //upto december charges is calculated
        for(var i = mmReturn + 1; i <= 12; i++)
        {
            monthCountTotal(i)
        }
        //in between no. of years calculation
        for(var i = yyyyReturn+1 ;i < yyyyActual; i++)
        {
            if( i % 4 == 0 ) yCountLeap++;
            else yCountLeapNot++;
        }
        //number of months calculated upto prev month of the actual returned month
        for(var i = 1; i < mmActual; i++)
        {
            monthCountTotal(i)
        }
        Charges_Rs = Charges_Rs + (yCountLeap*366 + yCountLeapNot*365) + (count30*30 + count31*31 + count29*29 + count28*28) + ddActual
    }
    else{
        Charges_Rs = -1
    }
    return Charges_Rs
}