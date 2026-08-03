import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { sendMail } from "./mailer";



const PIN_TTL_MS = 10 * 60 * 1000;  // 10 minutes    
export async function createAndSendVerificationPin(email: string) {
    const pin = crypto.randomInt(100000, 1000000).toString()
    const hashedPin = await bcrypt.hash(pin, 10)

    await prisma.verificationToken.deleteMany({
        where: {
            identifier: email
        }
    })

    await prisma.verificationToken.create({
        data: {
            identifier: email,
            token: hashedPin,
            expires: new Date(Date.now() + PIN_TTL_MS)
        }
    })

    const message = `Your verification PIN is: ${pin}`
    await sendMail(email, "Verify your email", message)


}