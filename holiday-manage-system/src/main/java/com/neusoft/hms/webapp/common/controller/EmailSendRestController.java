package com.neusoft.hms.webapp.common.controller;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.neusoft.hms.webapp.common.bean.EmailSendInfo;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Properties;

@Service
@EnableAsync
public class EmailSendRestController {

    /**
     * 发送邮件
     *
     * @param sendInfo 邮件相关信息
     * @return
     */
    @Async
    public void sendEmail(EmailSendInfo sendInfo) {
        Properties prop = new Properties();
        prop.setProperty("mail.smtp.user", sendInfo.getSendAddr());
        prop.setProperty("mail.smtp.host", "smtp.neusoft.com");
        prop.setProperty("mail.transport.protocol", "smtp");
        prop.setProperty("mail.smtp.auth", "true");
        prop.setProperty("mail.smtp.port", "587");
        prop.setProperty("mail.smtp.auth.mechanisms", "NTLM");
        Session session = Session.getDefaultInstance(prop);
        session.setDebug(true);
        Transport ts;
//        boolean result = false;
        try {
            ts = session.getTransport();
            ts.connect("smtp.neusoft.com", sendInfo.getSendAddr().split("@")[0], sendInfo.getPassword());
//            result = true;
            Message message = createMail(session, sendInfo.getSendAddr(), sendInfo.getReceiveAddr(),
                    sendInfo.getCcAddrs(), sendInfo.getTitle(), sendInfo.getComment());
            ts.sendMessage(message, message.getAllRecipients());
            ts.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 创建邮件主体内容
     */
    public MimeMessage createMail(Session session, String sendAddr, String receiveAddr, List<String> ccAddrs,
                                  String title, String comment) throws Exception {
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(sendAddr));
        message.setRecipient(RecipientType.TO, new InternetAddress(receiveAddr));
        Address[] addr = new Address[ccAddrs.size()];
        for (int i = 0; i < ccAddrs.size(); i++) {
            addr[i] = new InternetAddress(ccAddrs.get(i));
        }
        message.setRecipients(RecipientType.CC, addr);
        message.setSubject(title, "utf-8");
        message.setText(comment);
        message.saveChanges();
        return message;
    }
}
