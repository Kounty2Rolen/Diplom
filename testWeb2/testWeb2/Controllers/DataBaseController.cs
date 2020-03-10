﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using testWeb2.Model;
using System.Data.SqlClient;

namespace testWeb2.Controllers
{
    public class DataBaseController : Controller
    {
        public IActionResult GetTables([FromBody]string connectionString)
        {
            List<string> tables = new List<string>();
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var command = connection.CreateCommand();
                command.CommandText = "select * from INFORMATION_SCHEMA.TABLES";
                var resultReader = command.ExecuteReader();
                if (resultReader.HasRows)
                {
                    while (resultReader.Read())
                    {
                        tables.Add((string)resultReader.GetValue(2));
                    }
                }
                else
                {
                    return BadRequest();
                }



            }


            return Ok(Json(tables));
        }
    }
}