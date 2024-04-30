!include "FileFunc.nsh"
!addplugindir "${PROJECT_DIR}\electron\build\plugins"

!define DIR_NAME ${SHORTCUT_NAME}

Function IsWritable
  !define IsWritable `!insertmacro IsWritableCall`

  !macro IsWritableCall _PATH _RESULT
    Push `${_PATH}`
    Call IsWritable
    Pop ${_RESULT}
  !macroend

  Exch $R0
  Push $R1

start:
  # Checks if $R0 is not empty.
  StrLen $R1 $R0
  StrCmp $R1 0 exit
  # Checks if $R0 exists and is a directory.
  ${GetFileAttributes} $R0 "DIRECTORY" $R1
  StrCmp $R1 1 direxists
  # $R0 doesn't exist, getting parent.
  ${GetParent} $R0 $R0
  Goto start

direxists:
  # Checks if $R0 is a directory.
  ${GetFileAttributes} $R0 "DIRECTORY" $R1
  StrCmp $R1 0 nook
  # Checks if $R0 is read-only.
  ${GetFileAttributes} $R0 "READONLY" $R1
  # $R1 contains 1 (ro then not ok) or 0 (rw then ok).
  Goto exit

nook:
  StrCpy $R1 0

exit:
  Exch
  Pop $R0
  Exch $R1

FunctionEnd

Function .onVerifyInstDir
;  Push $R1
;  ${IsWritable} $INSTDIR $R1
;  IntCmp $R1 0 pathgood
;  Pop $R1
;  Abort
;
;pathgood:
;  Pop $R1

  ; append project name
  StrLen $0 "\${DIR_NAME}"
  StrCpy $1 "$INSTDIR" "" -$0
  StrCmp $1 "\${DIR_NAME}" +2 0
  StrCpy $INSTDIR "$INSTDIR\${DIR_NAME}"
FunctionEnd


!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"

  FindProcDLL::FindProc "${SHORTCUT_NAME}"
  Pop $R0
  IntCmp $R0 1 0 no_run
  MessageBox MB_OKCANCEL|MB_ICONSTOP  "安装程序检测到 ${SHORTCUT_NAME} 正在运行。$\r$\n$\r$\n点击 “确定” 强制关闭${SHORTCUT_NAME}，继续安装。$\r$\n点击 “取消” 退出安装程序。" IDCANCEL Exit
  KillProcDLL::KillProc "${SHORTCUT_NAME}"
  Sleep 1000
  FindProcDLL::FindProc "${SHORTCUT_NAME}"
  Pop $R0
  IntCmp $R0 1 0 no_run
  Exit:
    Quit
  no_run:
!macroend


!macro customUnInstall
  # 删除配置文件
  MessageBox MB_YESNO "是否删除应用程序配置和日志文件夹?" \
    /SD IDNO IDNO Skipped IDYES Accepted

  Accepted:
    RMDir /r "$APPDATA\${APP_FILENAME}"
    !ifdef APP_PRODUCT_FILENAME
      RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
    !endif
    Goto done
  Skipped:
    Goto done
  done:

  # 进程
  FindProcDLL::FindProc "${SHORTCUT_NAME}"
  Pop $R0
  IntCmp $R0 1 0 no_run
  MessageBox MB_OKCANCEL|MB_ICONSTOP  "卸载程序检测到 ${SHORTCUT_NAME} 正在运行。$\r$\n$\r$\n点击 “确定” 强制关闭${SHORTCUT_NAME}，继续卸载。$\r$\n点击 “取消” 退出卸载程序。" IDCANCEL Exit
  KillProcDLL::KillProc "${SHORTCUT_NAME}"
  Sleep 1000
  FindProcDLL::FindProc "${SHORTCUT_NAME}"
  Pop $R0
  IntCmp $R0 1 0 no_run
  Exit:
    Quit
  no_run:

  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_ID}"
!macroend


!macro customWelcomePage
  # Welcome Page is not added by default for installer.
  !insertMacro MUI_PAGE_WELCOME

  !define MUI_FINISHPAGE_SHOWREADME
  !define MUI_FINISHPAGE_SHOWREADME_Function AutoStartup
  !define MUI_FINISHPAGE_SHOWREADME_TEXT "开机时自动启动"

  Function AutoStartup
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_ID}" "$INSTDIR\${SHORTCUT_NAME}.exe"
  FunctionEnd
!macroend
