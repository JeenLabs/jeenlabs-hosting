import { Controller, Get } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { StaffRoleName } from '@app/types';

@Controller('api/v1')
export class AuthMeController {
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        customerId: user.customerId ?? null,
        staffId: user.staffId ?? null,
        staffRoles: user.staffRoles,
      },
    };
  }

  @Get('admin/ping')
  @Roles(StaffRoleName.SUPER_ADMIN)
  adminPing(@CurrentUser() user: AuthUser) {
    return {
      data: {
        ok: true,
        staffId: user.staffId,
        roles: user.staffRoles,
      },
    };
  }
}
