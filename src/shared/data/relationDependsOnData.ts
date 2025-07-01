// Auto-converted from relationDependsOnData.js
export interface RelationData {
  guid: string;
  name: string;
  source_guid: string;
  source_type: string;
  target_guid: string;
  target_type: string;
  creation_timestamp: string;
  creation_source: string;
}

export const relationDependsOnData = [
  {
    "guid": "2286b714-e670-eb5b-6ea0-53ccb5069473",
    "name": "hedgehog_library_depends_on_data_warehouse_service",
    "source_guid": "e0031b98-6d84-b242-5741-cfcdf8a33e97",
    "source_type": "component",
    "target_guid": "090a9ce6-ee1b-a49e-293b-1795dd6ca1c7",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341623",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "0245e97e-e48d-a309-37cd-786afdc4c4b4",
    "name": "query_editor_depends_on_plugin_server_public_api",
    "source_guid": "0531b44a-d3e8-f5c3-9b31-f2c89e4d05bb",
    "source_type": "component",
    "target_guid": "20d89e4a-bbaf-1443-3b6e-d25c4542b459",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341631",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "15f74002-ab82-d663-cf76-1b4debb33ca0",
    "name": "hedgehog_library_depends_on_materialized_columns_service",
    "source_guid": "e0031b98-6d84-b242-5741-cfcdf8a33e97",
    "source_type": "component",
    "target_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341639",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "05077992-9b49-a2f6-d147-d30021a6d783",
    "name": "async_migration_service_depends_on_query_editor",
    "source_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "source_type": "component",
    "target_guid": "0531b44a-d3e8-f5c3-9b31-f2c89e4d05bb",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341647",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "9402dc7b-4bd6-703c-4157-1490e01e5279",
    "name": "query_editor_depends_on_materialized_columns_service",
    "source_guid": "0531b44a-d3e8-f5c3-9b31-f2c89e4d05bb",
    "source_type": "component",
    "target_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341655",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "fccb3149-c12b-bc59-32b0-83580bf4533d",
    "name": "chart_library_depends_on_hogql_service",
    "source_guid": "dbbe55b7-b7f2-a442-fea3-c1c22026a855",
    "source_type": "component",
    "target_guid": "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341662",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "71e6005c-1fb1-c445-34dc-15fbc8bac4ba",
    "name": "batch_exports_service_depends_on_kea_store",
    "source_guid": "6a2a617c-026c-7041-f405-2dd216dff2f5",
    "source_type": "component",
    "target_guid": "b3d3d1a2-5bff-4e5e-1fd2-42226383c5d0",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341670",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "b8cfe3c4-a734-79cc-3d46-b69610f89259",
    "name": "query_builder_service_depends_on_async_migration_service",
    "source_guid": "1f7987d0-b56e-7b30-81df-7e421e2d2be2",
    "source_type": "component",
    "target_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341677",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "eb306237-c283-730d-66af-03d3f9762e7c",
    "name": "batch_exports_service_depends_on_materialized_columns_service",
    "source_guid": "6a2a617c-026c-7041-f405-2dd216dff2f5",
    "source_type": "component",
    "target_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341685",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "15bb6644-ca30-e494-9695-d1a378ef95e8",
    "name": "batch_exports_service_depends_on_hedgehog_library",
    "source_guid": "6a2a617c-026c-7041-f405-2dd216dff2f5",
    "source_type": "component",
    "target_guid": "e0031b98-6d84-b242-5741-cfcdf8a33e97",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341693",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "fccb3149-c12b-bc59-32b0-83580bf4533d",
    "name": "chart_library_depends_on_hogql_service",
    "source_guid": "dbbe55b7-b7f2-a442-fea3-c1c22026a855",
    "source_type": "component",
    "target_guid": "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341700",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "8172a848-d8d3-7a3e-24b3-8bbc99ad28c0",
    "name": "notebook_components_depends_on_data_warehouse_service",
    "source_guid": "9fa09542-12cc-cd21-a475-811c74c89038",
    "source_type": "component",
    "target_guid": "090a9ce6-ee1b-a49e-293b-1795dd6ca1c7",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341708",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "c3a35dc0-dfc4-3269-7cef-b58d4222ae28",
    "name": "event_pipeline_depends_on_prometheus_metrics_service",
    "source_guid": "03ed05f4-ea70-60cf-04b6-1e444557b6b3",
    "source_type": "component",
    "target_guid": "f5b2caae-6ba2-8ac0-6d0b-25a3e114d417",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341715",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "55abeb62-15ee-a3dc-bfde-8f34b36a9dcf",
    "name": "chart_library_depends_on_query_builder_service",
    "source_guid": "dbbe55b7-b7f2-a442-fea3-c1c22026a855",
    "source_type": "component",
    "target_guid": "1f7987d0-b56e-7b30-81df-7e421e2d2be2",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341723",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "dd587524-5b3f-0b6d-fad8-6ebc97b85f3d",
    "name": "plugin_vm_depends_on_event_pipeline",
    "source_guid": "2f890722-8a97-b54c-0a99-d9740869b2f3",
    "source_type": "component",
    "target_guid": "03ed05f4-ea70-60cf-04b6-1e444557b6b3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341730",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "39adb65c-1d2b-a91c-b317-dfdec58c0a79",
    "name": "data_warehouse_service_depends_on_async_migration_service",
    "source_guid": "090a9ce6-ee1b-a49e-293b-1795dd6ca1c7",
    "source_type": "component",
    "target_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341738",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "086e9eb1-685e-368d-b725-62089791772a",
    "name": "plugin_vm_depends_on_query_builder_service",
    "source_guid": "2f890722-8a97-b54c-0a99-d9740869b2f3",
    "source_type": "component",
    "target_guid": "1f7987d0-b56e-7b30-81df-7e421e2d2be2",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341746",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "bc466933-4322-053f-d1ee-00c97053b85d",
    "name": "hogql_service_depends_on_notebook_components",
    "source_guid": "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    "source_type": "component",
    "target_guid": "9fa09542-12cc-cd21-a475-811c74c89038",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341753",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "08809f2c-1384-bd41-ef43-04fed8a8d93f",
    "name": "materialized_columns_service_depends_on_kea_store",
    "source_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "source_type": "component",
    "target_guid": "b3d3d1a2-5bff-4e5e-1fd2-42226383c5d0",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341761",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "ce8239b2-9f12-3f80-1bdb-134de60ba9cd",
    "name": "notebook_components_depends_on_query_editor",
    "source_guid": "9fa09542-12cc-cd21-a475-811c74c89038",
    "source_type": "component",
    "target_guid": "0531b44a-d3e8-f5c3-9b31-f2c89e4d05bb",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341768",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "ecbcab41-e65a-3970-6d6a-2ab9bdcd8af7",
    "name": "plugin_scheduler_depends_on_materialized_columns_service",
    "source_guid": "601fe84b-df42-86f0-ed9c-a76a71ea4b4a",
    "source_type": "component",
    "target_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341776",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "ab54890d-ad78-37a5-35b4-bd8da828ada7",
    "name": "async_migration_service_depends_on_chart_library",
    "source_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "source_type": "component",
    "target_guid": "dbbe55b7-b7f2-a442-fea3-c1c22026a855",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341783",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "38335671-1251-8126-dc0b-2073084b1882",
    "name": "query_editor_depends_on_async_migration_service",
    "source_guid": "0531b44a-d3e8-f5c3-9b31-f2c89e4d05bb",
    "source_type": "component",
    "target_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341791",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "71e6005c-1fb1-c445-34dc-15fbc8bac4ba",
    "name": "batch_exports_service_depends_on_kea_store",
    "source_guid": "6a2a617c-026c-7041-f405-2dd216dff2f5",
    "source_type": "component",
    "target_guid": "b3d3d1a2-5bff-4e5e-1fd2-42226383c5d0",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341798",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "5b25926b-9fb9-8a81-b774-d45bb47b82d3",
    "name": "async_migration_service_depends_on_notebook_components",
    "source_guid": "2d975ee6-a46d-00a4-6aef-61f4b4e4a11a",
    "source_type": "component",
    "target_guid": "9fa09542-12cc-cd21-a475-811c74c89038",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341806",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "ecbcab41-e65a-3970-6d6a-2ab9bdcd8af7",
    "name": "plugin_scheduler_depends_on_materialized_columns_service",
    "source_guid": "601fe84b-df42-86f0-ed9c-a76a71ea4b4a",
    "source_type": "component",
    "target_guid": "e1bdfb22-f0a8-fa9c-ea85-644aacf025d3",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341813",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "d73bd6cb-b66d-6c7f-6c6f-50553151edf8",
    "name": "hedgehog_library_depends_on_hogql_service",
    "source_guid": "e0031b98-6d84-b242-5741-cfcdf8a33e97",
    "source_type": "component",
    "target_guid": "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341821",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "e1e970f3-2912-61c3-f373-7fca9616e08e",
    "name": "plugin_vm_depends_on_plugin_scheduler",
    "source_guid": "2f890722-8a97-b54c-0a99-d9740869b2f3",
    "source_type": "component",
    "target_guid": "601fe84b-df42-86f0-ed9c-a76a71ea4b4a",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341828",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "d73bd6cb-b66d-6c7f-6c6f-50553151edf8",
    "name": "hedgehog_library_depends_on_hogql_service",
    "source_guid": "e0031b98-6d84-b242-5741-cfcdf8a33e97",
    "source_type": "component",
    "target_guid": "b2b7a571-6084-c563-ba64-cb3d22c1dd6f",
    "target_type": "component",
    "creation_timestamp": "2025-04-23T20:16:30.341836",
    "creation_source": "posthog/posthog_fork/README.md"
  }
];
