
package lib.dbSource;

import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

public class dbUtil {
    private String url;
    private String user;
    private String password;

    public dbUtil(String url, String user, String password) {
        this.url = url;
        this.user = user;
        this.password = password;
    }

    public int executeStatement(String sql) throws Exception {
        int noOfRowsImpacted;
        Connection conn = null;
        Statement stmt = null;
        noOfRowsImpacted = 0;
        try {
            conn = this.getConnection();
            stmt = conn.createStatement();
            noOfRowsImpacted = stmt.executeUpdate(sql);
        }
        finally {
            if (stmt != null) {
                stmt.close();
                stmt = null;
            }
            if (conn != null) {
                conn.close();
                conn = null;
            }
        }
        return noOfRowsImpacted;
    }

    public String executeQuery(String query) throws Exception {
        ArrayList resultList;
        StringBuilder resultBuilder = new StringBuilder();
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        resultList = new ArrayList();
        try {
            conn = this.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(query);
            int colCount = rs.getMetaData().getColumnCount();
            while (rs.next()) {
                HashMap<String, String> rowMap = new HashMap<String, String>();
                int i = 1;
                while (i <= colCount) {
                    rowMap.put(rs.getMetaData().getColumnName(i), rs.getString(i));
                    ++i;
                }
                resultList.add(rowMap);
            }
        }
        finally {
            if (rs != null) {
                rs.close();
                rs = null;
            }
            if (stmt != null) {
                stmt.close();
                stmt = null;
            }
            if (conn != null) {
                conn.close();
                conn = null;
            }
        }
        String results = null;
        results = resultList.size() == 1 ? new Gson().toJson(resultList.get(0)) : new Gson().toJson(resultList);
        return results;
    }

    private Connection getConnection() throws Exception {
        Class.forName("oracle.jdbc.driver.OracleDriver");
        return DriverManager.getConnection(this.url, this.user, this.password);
    }
}

