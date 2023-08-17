import { PrivateSecTemplateInterface } from '@interfaces/private-sec-template.interface';

export const defaultSecurityTemplate = ({
  title,
  content,
  button,
  link
}: PrivateSecTemplateInterface) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <!--<![endif]-->
    <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
    <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
    <style type="text/css">
        body, p, div {
          font-family: inherit;
          font-size: 14px;
        }
        body {
          color: #fff;
        }
        body a {
          color: #1188E6;
          text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
          width:100% !important;
          table-layout: fixed;
          -webkit-font-smoothing: antialiased;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img.max-width {
          max-width: 100% !important;
        }
        .column.of-2 {
          width: 50%;
        }
        .column.of-3 {
          width: 33.333%;
        }
        .column.of-4 {
          width: 25%;
        }
        @media screen and (max-width:480px) {
          .preheader .rightColumnContent,
          .footer .rightColumnContent {
            text-align: left !important;
          }
          .preheader .rightColumnContent div,
          .preheader .rightColumnContent span,
          .footer .rightColumnContent div,
          .footer .rightColumnContent span {
            text-align: left !important;
          }
          .preheader .rightColumnContent,
          .preheader .leftColumnContent {
            font-size: 80% !important;
            padding: 5px 0;
          }
          table.wrapper-mobile {
            width: 100% !important;
            table-layout: fixed;
          }
          img.max-width {
            height: auto !important;
            max-width: 100% !important;
          }
          a.bulletproof-button {
            display: block !important;
            width: auto !important;
            font-size: 80%;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .columns {
            width: 100% !important;
          }
          .column {
            display: block !important;
            width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
    </style>
    <!--user entered Head Start-->
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&display=swap" rel="stylesheet">
    <style>
        body {font-family: 'Fira Sans Condensed', sans-serif;}
    </style>
    <!--End Head user entered-->
</head>

<body>
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
        <div class="webkit">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f0f0f0">
                <tbody>
                    <tr>
                        <td valign="top" bgcolor="#f0f0f0" width="100%">
                            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                                <tbody>
                                    <tr>
                                        <td width="100%">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                                                <tbody>
                                                                    <tr>
                                                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left">
                                                                            <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td role="module-content">
                                                                                            <p></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 0px 30px 20px;" bgcolor="#fff">
                                                                                <tbody>
                                                                                    <tr role="module-content">
                                                                                        <td height="100%" valign="top">
                                                                                            <table class="column" width="560" style="width:560px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="padding:0px;margin:0px;border-spacing:0;">
                                                                                                            <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a169501c-69eb-4f62-ad93-ac0150abdf03">
                                                                                                                <tbody>
                                                                                                                    <tr>
                                                                                                                        <td style="font-size:18px; line-height:10px; padding:0px 0px 0px 0px;color:#000" valign="top" align="left">
                                                                                                                           Mnemosyne
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>

                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="080768f5-7b16-4756-a254-88cfe5138113">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="padding:30px 30px 18px 30px; line-height:28px; text-align:inherit; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                                                                                            <div>
                                                                                                <div style="font-family: inherit; text-align: center"><span style="color: #000; font-size: 32px; font-family: inherit">${title}</span></div>
                                                                                                <div></div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="cddc0490-36ba-4b27-8682-87881dfbcc14">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                                                                                            <div>
                                                                                                <div style="font-family: inherit; text-align: inherit"><span style="color: #000; font-size: 15px">${content}</span></div>
                                                                                                <div></div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="cd669415-360a-41a6-b4b4-ca9e149980b3">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" bgcolor="#fff" class="outer-td" style="padding:10px 0px 40px 0px;">
                                                                                            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td align="center" bgcolor="#ffc94c" class="inner-td" style="cursor:pointer; border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                                                                            <a href="${link}" style="cursor:pointer;background-color:#ffc94c; border:1px solid #ffc94c; border-color:#ffc94c; border-radius:40px; border-width:1px; color:#3f4259; display:inline-block; font-size:15px; font-weight:normal; letter-spacing:0px; line-height:25px; padding:12px 18px 10px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit; width:168px;" target="">${button}</a>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="c5a3c312-4d9d-44ff-9fce-6a8003caeeca">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="padding:0px 20px 0px 20px;" role="module-content" height="100%" valign="top" bgcolor="#fff">
                                                                                            <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="1px" style="line-height:1px; font-size:1px;">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="padding:0px 0px 1px 0px;" bgcolor="#ffc94c"></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="eb301547-da19-441f-80a1-81e1b56e64ad">
                                                                            </table>
                                                                            <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2931446b-8b48-42bd-a70c-bffcfe784680">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="padding:0px 0px 10px 0px;" role="module-content" bgcolor="#fff">
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
                                                                                <div class="Unsubscribe--addressLine">
                                                                                    <p class="Unsubscribe--senderName" style="font-size:12px; line-height:20px;color:#000">Mnemosyne</p>
<!--                                                                                    <p style="font-size:12px; line-height:20px;"><span class="Unsubscribe&#45;&#45;senderAddress">{{Sender_Address}}</span>, <span class="Unsubscribe&#45;&#45;senderCity">{{Sender_City}}</span>, <span class="Unsubscribe&#45;&#45;senderState">{{Sender_State}}</span> <span class="Unsubscribe&#45;&#45;senderZip">{{Sender_Zip}}</span></p>-->
                                                                                </div>
                                                                            </div>
                                                                            <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="5f89d789-2bfd-48e2-a219-1de42476c398">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 20px 0px;">
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </center>

</body>

</html>
  `;
};
