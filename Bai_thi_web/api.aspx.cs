using QuanLyKhachSan;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Bai_thi_web
{
    public partial class api : System.Web.UI.Page
    {
        void customer(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("SP_Customer", action);

            switch (action)
            {
                case "list_customer":
                case "add_customer":
                case "edit_customer":
                case "delete_customer":
                    cm.Parameters.Add("@id", SqlDbType.Int).Value = Request["id"];
                    cm.Parameters.Add("@fullName", SqlDbType.NVarChar, 50).Value = Request["fullName"];
                    cm.Parameters.Add("@sex", SqlDbType.NVarChar, 50).Value = Request["sex"];
                    cm.Parameters.Add("@idNunber", SqlDbType.NVarChar, 50).Value = Request["idNunber"];
                    cm.Parameters.Add("@phone", SqlDbType.NVarChar, 50).Value = Request["phone"];
                    cm.Parameters.Add("@address", SqlDbType.NVarChar, 255).Value = Request["address"];

                    break;
            }
            string json = (string)db.Scalar(cm);
            this.Response.Write(json);
        }



        void room(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("SP_Room", action);

            switch (action)
            {
                case "list_room":
                case "add_room":
                case "edit_room":
                case "delete_room":
                    cm.Parameters.Add("@id", SqlDbType.Int).Value = Request["id"];
                    cm.Parameters.Add("@Name", SqlDbType.NVarChar, 50).Value = Request["Name"];
                    cm.Parameters.Add("@status", SqlDbType.NVarChar, 50).Value = Request["status"];
                    cm.Parameters.Add("@price", SqlDbType.NVarChar, 50).Value = Request["price"];
                   
                    break;
            }
            string json = (string)db.Scalar(cm);
            this.Response.Write(json);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];

            switch (action)
            {
                case "add_customer":
                case "edit_customer":
                case "delete_customer":
                case "list_customer":
                    customer(action);
                    break;

            }
            switch (action)
            {
                case "list_room":
                case "delete_room":
                case "edit_room":
                   room(action);
                 break;
            }
          
        }




        
       
    }
}