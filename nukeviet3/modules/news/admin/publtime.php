<?php

/**
 * @Project NUKEVIET 3.0
 * @Author VINADES.,JSC (contact@vinades.vn)
 * @Copyright (C) 2010 VINADES.,JSC. All rights reserved
 * @Createdate 2-9-2010 14:43
 */
if ( ! defined( 'NV_IS_FILE_ADMIN' ) ) die( 'Stop!!!' );

if ( $nv_Request->isset_request( 'checkss', 'get' ) and $nv_Request->get_string( 'checkss', 'get' ) == md5( $global_config['sitekey'] . session_id() ) )
{
    $listid = $nv_Request->get_string( 'listid', 'get' );
    $id_array = array_map( "intval", explode( ",", $listid ) );
    $sql = "SELECT `id`, `listcatid`, `status`, `publtime`, `exptime`  FROM " . NV_PREFIXLANG . "_" . $module_data . "_rows WHERE `id` in (" . implode( ",", $id_array ) . ")";
    $result = $db->sql_query( $sql );
    while ( list( $id, $listcatid, $status, $publtime, $exptime ) = $db->sql_fetchrow( $result ) )
    {
        $data_save = array();
        if ( $exptime > 0 and $exptime < NV_CURRENTTIME )
        {
            $data_save['exptime'] = 0;
        }
        if ( $publtime > NV_CURRENTTIME )
        {
            $data_save['publtime'] = NV_CURRENTTIME;
        }
        if ( $status == 0 )
        {
            $data_save['status'] = 1;
        }
        if ( ! empty( $data_save ) )
        {
            nv_save_log_content( $id );
            $arr_catid = array_map( "intval", explode( ",", $listcatid ) );
            
            $s_ud = "";
            foreach ( $data_save as $key => $value )
            {
                $s_ud .= "`" . $key . "` = '" . $value . "', ";
            }
            $s_ud .= "`edittime` = '" . NV_CURRENTTIME . "'";
            $db->sql_query( "UPDATE `" . NV_PREFIXLANG . "_" . $module_data . "_rows` " . $s_ud . " WHERE `id` =" . $id . "" );
            foreach ( $arr_catid as $catid_i )
            {
                $db->sql_query( "UPDATE `" . NV_PREFIXLANG . "_" . $module_data . "_" . $catid_i . "` SET " . $s_ud . " WHERE `id` =" . $id . "" );
            }
        }
    }
    nv_del_moduleCache($module_name);
}
Header( "Location: " . NV_BASE_ADMINURL . "index.php?" . NV_NAME_VARIABLE . "=" . $module_name . "" );
die();
?>