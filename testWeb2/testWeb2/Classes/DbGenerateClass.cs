﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Scaffolding.Internal;
using Microsoft.EntityFrameworkCore.Design.Internal;
using Microsoft.EntityFrameworkCore.Scaffolding;
using Microsoft.EntityFrameworkCore.Utilities;
using Microsoft.Extensions.DependencyInjection;
using JetBrains.Annotations;
using System.IO;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Design;

namespace DiplomWork.Classes
{
    public static class CustomReverseEngineerScaffolder
    {
        public static ScaffoldedModel ScaffoldContext(
            [NotNull] string provider,
            [NotNull] string connectionString,
            [CanBeNull] string outputDir,
            [CanBeNull] string outputContextDir,
            [CanBeNull] string dbContextClassName,
            [NotNull] IEnumerable<string> schemas,
            [NotNull] IEnumerable<string> tables,
            bool useDataAnnotations,
            bool overwriteFiles,
            bool useDatabaseNames)
        {
            //Check.NotEmpty(provider, nameof(provider));
            //Check.NotEmpty(connectionString, nameof(connectionString));
            //Check.NotNull(schemas, nameof(schemas));
            //Check.NotNull(tables, nameof(tables));
            var unwrappedReportHandler = ForwardingProxy.Unwrap<IOperationReportHandler>(new OperationReportHandler());
            var reporter = new OperationReporter(unwrappedReportHandler);
            var _servicesBuilder = new DesignTimeServicesBuilder(Assembly.GetExecutingAssembly(), reporter, Array.Empty<string>());
            var services = _servicesBuilder.Build(provider);
            var scaffolder = services.GetRequiredService<IReverseEngineerScaffolder>();

            var @namespace = "DiplomWork";

            //var subNamespace = SubnamespaceFromOutputPath(_projectDir, outputDir);
            //if (!string.IsNullOrEmpty(subNamespace))
            //{
            //    @namespace += "." + subNamespace;
            //}

            var scaffoldedModel = scaffolder.ScaffoldModel(
                connectionString,
                tables,
                schemas,
                @namespace,
                null,
                MakeDirRelative(outputDir, outputContextDir),
                dbContextClassName,
                new ModelReverseEngineerOptions { UseDatabaseNames = useDatabaseNames },
                new ModelCodeGenerationOptions { UseDataAnnotations = useDataAnnotations });

            return scaffoldedModel;
        }
        private static string MakeDirRelative(string root, string path)
        {
            var relativeUri = new Uri(NormalizeDir(root)).MakeRelativeUri(new Uri(NormalizeDir(path)));

            return Uri.UnescapeDataString(relativeUri.ToString()).Replace('/', Path.DirectorySeparatorChar);
        }
        private static string NormalizeDir(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return path;
            }

            var last = path[path.Length - 1];
            if (last == Path.DirectorySeparatorChar
                || last == Path.AltDirectorySeparatorChar)
            {
                return path;
            }

            return path + Path.DirectorySeparatorChar;
        }

    }
}