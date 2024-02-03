import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { SiweMessage, generateNonce } from 'siwe';
import { SiweService } from './siwe.service';

@Controller('siwe')
export class SiweController {
  constructor(private readonly siweService: SiweService) {}

  @Get('nonce')
  @Header('Content-Type', 'text/plain')
  @HttpCode(HttpStatus.OK)
  getNonce(@Session() session: Record<string, any>) {
    const nonce = generateNonce();

    session.nonce = nonce;
    return nonce;
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body('message') message: string,
    @Body('signature') signature: string,
    @Session() session: Record<string, any>,
  ): Promise<boolean> {
    try {
      const siweMessage = new SiweMessage(message);

      // 這邊需要將簽名跟簽名的訊息做驗證，驗證成功就設定 session 跟登入成功
      const { data: verifyMessage } = await siweMessage.verify({
        signature,
        nonce: session.nonce,
      });

      const { address, chainId } = verifyMessage;

      await this.siweService.processUser(address);

      //登入成功 -> 設定 session
      session.siwe = { address, chainId };

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  getSession(@Session() session: Record<string, any>) {
    console.log(session);
    if (!session.siwe) {
      throw new ForbiddenException('No Session');
    }
    return session.siwe;
  }

  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Session() session: Record<string, any>): boolean {
    session.destroy();

    return true;
  }

  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async deleteUser() {
    await this.siweService.deleteUser();

    return true;
  }
}
