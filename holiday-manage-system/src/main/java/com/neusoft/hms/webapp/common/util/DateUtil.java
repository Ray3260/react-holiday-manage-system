package com.neusoft.hms.webapp.common.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
    
    // 将string类型日期转为java.sql.Timestamp类型
    public static Timestamp stringToTimestamp(String str) {
        if (!"".equals(str) && str != null) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                Date date = simpleDateFormat.parse(str);
                Timestamp dateSQL = new Timestamp(date.getTime());
                return dateSQL;
            } catch (ParseException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return null;
    }
}
